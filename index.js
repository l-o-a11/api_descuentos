import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error conectando a MongoDB", err));

const descuentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  municipio: { type: String, required: true },
  nombre_contacto: { type: String, required: true },
  celular: { type: String, required: true }
});

const Descuento = mongoose.model("Descuento", descuentoSchema);

app.get("/descuentos", async (req, res) => {
  const descuentos = await Descuento.find();
  res.json(descuentos);
});

app.get("/descuentos/:id", async (req, res)=>{
  const descuento = await Descuento.findById(req.params.id);
  res.json(descuento);
})

app.post("/descuentos", async (req, res) => {
  const nuevoDescuento = new Descuento(req.body);
  await nuevoDescuento.save();
  res.status(201).json('Descuento creado exitosamente');
});
app.put("/descuentos/:id", async (req, res) => {
  const descuentoModificacion = await Descuento.findByIdAndUpdate(req.params.id, req.body, {new: true});
  if(!descuentoModificacion){
    res.status(404).json('Descuento no encontrado');
  }
  else{
    res.status(202).json('Descuento actualizado correctamente');
  }
});

app.delete("/descuentos/:id", async(req, res)=>{
  const descuentoEliminado = await Descuento.findByIdAndDelete(req.params.id);
  res.json({msg:"Descuento Eliminado"})
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${process.env.PORT}`);
});
