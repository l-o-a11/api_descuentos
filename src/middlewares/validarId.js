import mongoose from "mongoose";
import { ErrorHttp } from "../utils/ErrorHttp.js";

export function validarId(req, _res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHttp(400, "El id proporcionado no es válido"));
  }
  next();
}
