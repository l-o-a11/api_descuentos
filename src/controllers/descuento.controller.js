import { Descuento } from "../models/Descuento.js";
import { ErrorHttp } from "../utils/ErrorHttp.js";

const CAMPOS = ["nombre", "precio", "municipio", "nombre_contacto", "celular"];

// Solo permite los campos definidos (evita asignación masiva)
const filtrarCampos = (body = {}) =>
  Object.fromEntries(CAMPOS.filter((c) => body[c] !== undefined).map((c) => [c, body[c]]));

const escaparRegex = (texto) => String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listar(req, res) {
  const { municipio, buscar } = req.query;
  const pagina = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limite = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filtro = {};
  if (municipio) filtro.municipio = new RegExp(`^${escaparRegex(municipio)}$`, "i");
  if (buscar) filtro.nombre = new RegExp(escaparRegex(buscar), "i");

  const [data, total] = await Promise.all([
    Descuento.find(filtro)
      .sort({ createdAt: -1 })
      .skip((pagina - 1) * limite)
      .limit(limite),
    Descuento.countDocuments(filtro),
  ]);

  res.json({
    ok: true,
    data,
    paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
  });
}

export async function obtenerPorId(req, res) {
  const descuento = await Descuento.findById(req.params.id);
  if (!descuento) throw new ErrorHttp(404, "Descuento no encontrado");
  res.json({ ok: true, data: descuento });
}

export async function crear(req, res) {
  const descuento = await Descuento.create(filtrarCampos(req.body));
  res.status(201).json({ ok: true, mensaje: "Descuento creado exitosamente", data: descuento });
}

export async function actualizar(req, res) {
  const descuento = await Descuento.findByIdAndUpdate(
    req.params.id,
    filtrarCampos(req.body),
    { new: true, runValidators: true }
  );
  if (!descuento) throw new ErrorHttp(404, "Descuento no encontrado");
  res.json({ ok: true, mensaje: "Descuento actualizado correctamente", data: descuento });
}

export async function eliminar(req, res) {
  const descuento = await Descuento.findByIdAndDelete(req.params.id);
  if (!descuento) throw new ErrorHttp(404, "Descuento no encontrado");
  res.json({ ok: true, mensaje: "Descuento eliminado correctamente" });
}
