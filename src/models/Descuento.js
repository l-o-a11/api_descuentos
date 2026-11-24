import mongoose from "mongoose";

const descuentoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [120, "El nombre no puede superar los 120 caracteres"],
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    municipio: {
      type: String,
      required: [true, "El municipio es obligatorio"],
      trim: true,
    },
    nombre_contacto: {
      type: String,
      required: [true, "El nombre de contacto es obligatorio"],
      trim: true,
    },
    celular: {
      type: String,
      required: [true, "El celular es obligatorio"],
      trim: true,
      match: [/^3\d{9}$/, "El celular debe tener 10 dígitos y empezar por 3"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

export const Descuento = mongoose.model("Descuento", descuentoSchema);
