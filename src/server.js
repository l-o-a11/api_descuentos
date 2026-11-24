import { env } from "./config/env.js";
import { conectarDB, desconectarDB } from "./config/db.js";
import app from "./app.js";

async function iniciar() {
  try {
    await conectarDB(env.MONGO_URI);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }

  const servidor = app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
  });

  // Cierre ordenado
  const cerrar = (senal) => {
    console.log(`\n${senal} recibida. Cerrando servidor...`);
    servidor.close(async () => {
      await desconectarDB();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => cerrar("SIGINT"));
  process.on("SIGTERM", () => cerrar("SIGTERM"));
}

process.on("unhandledRejection", (err) => {
  console.error("Promesa rechazada sin manejar:", err);
  process.exit(1);
});

iniciar();
