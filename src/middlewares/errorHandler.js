import { ErrorHttp } from "../utils/ErrorHttp.js";

export function noEncontrado(req, _res, next) {
  next(new ErrorHttp(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  // Errores de validación de Mongoose
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => ({
      campo: e.path,
      mensaje: e.message,
    }));
    return res.status(400).json({ ok: false, mensaje: "Datos inválidos", errores });
  }

  // JSON mal formado en el body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, mensaje: "El cuerpo de la petición no es un JSON válido" });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    ok: false,
    mensaje: status === 500 ? "Error interno del servidor" : err.message,
  });
}
