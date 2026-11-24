import mongoose from "mongoose";

export async function conectarDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("Conectado a MongoDB Atlas");
}

export async function desconectarDB() {
  await mongoose.connection.close();
  console.log("Conexión a MongoDB cerrada");
}
