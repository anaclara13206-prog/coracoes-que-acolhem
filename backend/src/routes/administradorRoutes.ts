import { Router } from "express";
import { listarPublicos, minhaEmpresa, atualizarMinhaEmpresa } from "../controllers/administradorController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
const router = Router();
router.get("/publicos", listarPublicos);
router.get("/minha", autenticar, isAdmin, minhaEmpresa);
router.put("/minha", autenticar, isAdmin, atualizarMinhaEmpresa);
export default router;
