import { Router } from "express";
import { cadastro, cadastroInstituicao, login, solicitarSenha, redefinir } from "../controllers/authController.js";
import { autenticar, RequestAutenticada } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/cadastro", cadastro);
router.post("/login", login);
router.post("/cadastro-instituicao", cadastroInstituicao);
router.post("/esqueci-senha", solicitarSenha);
router.post("/redefinir-senha", redefinir);
router.get("/perfil", autenticar, (req: RequestAutenticada, res) => {
  return res.json({ mensagem: "Usuário autenticado com sucesso.", usuario: req.usuario });
});
export default router;
