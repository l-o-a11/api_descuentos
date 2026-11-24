import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("Falta la variable de entorno obligatoria: MONGO_URI");
  process.exit(1);
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
