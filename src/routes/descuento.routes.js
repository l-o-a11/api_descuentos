import { Router } from "express";
import * as controller from "../controllers/descuento.controller.js";
import { validarId } from "../middlewares/validarId.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(controller.listar));
router.post("/", asyncHandler(controller.crear));
router.get("/:id", validarId, asyncHandler(controller.obtenerPorId));
router.put("/:id", validarId, asyncHandler(controller.actualizar));
router.delete("/:id", validarId, asyncHandler(controller.eliminar));

export default router;
