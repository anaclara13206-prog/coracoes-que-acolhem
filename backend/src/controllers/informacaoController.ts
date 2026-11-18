import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { listarInformacoes, buscarInformacaoPorId, criarInformacao, atualizarInformacao, deletarInformacao } from "../services/informacaoService.js";
import { buscarAdministradorPorUsuario } from "../services/administradorService.js";
export async function listar(_req: Request, res: Response) {
  try {
    return res.json(await listarInformacoes());
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar informações." });
  }
}
export async function buscarPorId(req: Request, res: Response) {
  try {
    return res.json(await buscarInformacaoPorId(Number(req.params.id)));
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Informação não encontrada." });
  }
}
export async function listarAdmin(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(await listarInformacoes(admin.idAdministrador));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar suas informações." });
  }
}
export async function criar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const { titulo, conteudo, fonte, categoria, imagemUrl } = req.body;
    if (!titulo || !conteudo)
      return res.status(400).json({ mensagem: "Título e conteúdo são obrigatórios." });
    return res.status(201).json(await criarInformacao({ titulo, conteudo, fonte, categoria, imagemUrl, idAdministrador: admin.idAdministrador }));
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível criar a informação." });
  }
}
export async function atualizar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(await atualizarInformacao(Number(req.params.id), req.body, admin.idAdministrador));
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível atualizar a informação." });
  }
}
export async function remover(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    await deletarInformacao(Number(req.params.id), admin.idAdministrador);
    return res.json({ mensagem: "Informação removida com sucesso." });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível remover a informação." });
  }
}
