import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { criarQuestionario, listarQuestionariosDoUsuario, listarQuestionariosDaInstituicao, atualizarStatusQuestionario } from "../services/questionarioService.js";
import { buscarAdministradorPorUsuario } from "../services/administradorService.js";
export async function criar(req: RequestAutenticada, res: Response) {
  try {
    const { idAdministrador, idVoluntario, respostas } = req.body;
    if (!idAdministrador || !respostas || typeof respostas !== "object")
      return res.status(400).json({ mensagem: "Instituição e respostas são obrigatórias." });
    const resultado = await criarQuestionario({
      idUsuario: req.usuario!.id, idAdministrador: Number(idAdministrador), idVoluntario: idVoluntario ? Number(idVoluntario) : undefined, respostas
    });
    return res.status(201).json({ mensagem: "Questionário enviado com sucesso.", questionario: resultado });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível enviar o questionário." });
  }
}
export async function minhas(req: RequestAutenticada, res: Response) {
  try {
    return res.json(await listarQuestionariosDoUsuario(req.usuario!.id));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao carregar seus questionários." });
  }
}
export async function listar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(await listarQuestionariosDaInstituicao(admin.idAdministrador));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar questionários." });
  }
}
export async function atualizarStatus(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const { status } = req.body;
    const statusNormalizado = String(status || "").trim().toLowerCase();
    if (!["pendente", "aprovado", "recusado"].includes(statusNormalizado))
      return res.status(400).json({ mensagem: "Status inválido. Use pendente, aprovado ou recusado." });
    return res.json(await atualizarStatusQuestionario(Number(req.params.id), statusNormalizado, admin.idAdministrador));
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível atualizar o questionário." });
  }
}
