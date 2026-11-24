import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import descuentoRoutes from "./routes/descuento.routes.js";
import { noEncontrado, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

const origenes = env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((o) => o.trim());

app.use(helmet());
app.use(cors({ origin: origenes }));
app.use(express.json({ limit: "10kb" }));
if (env.NODE_ENV !== "test") app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, mensaje: "Demasiadas peticiones, intente más tarde" },
  })
);

app.get("/health", (_req, res) => {
  const conectado = mongoose.connection.readyState === 1;
  res.status(conectado ? 200 : 503).json({
    ok: conectado,
    servicio: "descuentos-api",
    baseDeDatos: conectado ? "conectada" : "desconectada",
    uptime: Math.round(process.uptime()),
  });
});

app.use("/api/descuentos", descuentoRoutes);

app.use(noEncontrado);
app.use(errorHandler);

export default app;
