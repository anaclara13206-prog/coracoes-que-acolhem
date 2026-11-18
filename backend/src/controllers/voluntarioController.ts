import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { buscarAdministradorPorUsuario } from "../services/administradorService.js";
import { listarVoluntarios, buscarVoluntarioPorUsuario, inscreverVoluntario, buscarVoluntarioPorId, atualizarStatusVoluntario, finalizarVoluntario, deletarVoluntario, listarPresencas, registrarPresenca } from "../services/voluntarioService.js";
export async function listar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(await listarVoluntarios(admin.idAdministrador));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar voluntários." });
  }
}
export async function minhaInscricao(req: RequestAutenticada, res: Response) {
  try {
    return res.json(await buscarVoluntarioPorUsuario(req.usuario!.id));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao buscar inscrições." });
  }
}
export async function inscrever(req: RequestAutenticada, res: Response) {
  try {
    const { disponibilidade, motivacao, experiencia, idade, cidade, areaInteresse, idAdministrador, idQuestionario } = req.body;
    if (!idAdministrador)
      return res.status(400).json({ mensagem: "Escolha uma instituição para o voluntariado." });
    const voluntario = await inscreverVoluntario({
      disponibilidade, motivacao, experiencia, idade: idade ? Number(idade) : undefined,
      cidade, areaInteresse, idUsuario: req.usuario!.id, idAdministrador: Number(idAdministrador),
      idQuestionario: idQuestionario ? Number(idQuestionario) : undefined
    });
    return res.status(201).json({ mensagem: "Inscrição de voluntariado realizada com sucesso.", voluntario });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Erro ao se inscrever." });
  }
}
export async function buscarPorId(req: Request, res: Response) {
  try {
    return res.json(await buscarVoluntarioPorId(Number(req.params.id)));
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Voluntário não encontrado." });
  }
}
export async function atualizarStatus(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ mensagem: "O status é obrigatório." });
    return res.json({ mensagem: "Status atualizado com sucesso.", voluntario: await atualizarStatusVoluntario(Number(req.params.id), status, admin.idAdministrador) });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Voluntário não encontrado." });
  }
}
export async function finalizar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json({ mensagem: "Voluntariado finalizado e histórico registrado.", voluntario: await finalizarVoluntario(Number(req.params.id), admin.idAdministrador) });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível finalizar o voluntariado." });
  }
}
export async function presencas(req: RequestAutenticada, res: Response) {
  try {
    const voluntario = await buscarVoluntarioPorId(Number(req.params.id));
    if (voluntario.idUsuario !== req.usuario!.id) {
      const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
      if (!admin || voluntario.idAdministrador !== admin.idAdministrador)
        return res.status(403).json({ mensagem: "Acesso não permitido." });
    }
    return res.json(await listarPresencas(Number(req.params.id)));
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Não foi possível carregar a frequência." });
  }
}
export async function registrarFrequencia(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const { data, horaInicio, horaFim, status, observacao } = req.body;
    if (!data || !status)
      return res.status(400).json({ mensagem: "Data e status são obrigatórios." });
    return res.status(201).json(await registrarPresenca(Number(req.params.id), { data, horaInicio, horaFim, status, observacao }, admin.idAdministrador));
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível registrar a frequência." });
  }
}
export async function remover(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    await deletarVoluntario(Number(req.params.id), admin.idAdministrador);
    return res.json({ mensagem: "Voluntário removido com sucesso." });
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Voluntário não encontrado." });
  }
}
