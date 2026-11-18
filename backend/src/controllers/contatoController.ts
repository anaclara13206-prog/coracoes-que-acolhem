import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { listarContatos, listarContatosPorUsuario, buscarContatoPorId, criarContato, deletarContato, responderContato } from "../services/contatoService.js";
import { buscarAdministradorPorUsuario } from "../services/administradorService.js";
export async function listar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(await listarContatos(admin.idAdministrador));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar contatos." });
  }
}
export async function minhas(req: RequestAutenticada, res: Response) {
  try {
    return res.json(await listarContatosPorUsuario(req.usuario!.id));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao carregar suas mensagens." });
  }
}
export async function buscarPorId(req: Request, res: Response) {
  try {
    return res.json(await buscarContatoPorId(Number(req.params.id)));
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Contato não encontrado." });
  }
}
export async function criar(req: Request, res: Response) {
  try {
    const { nome, email, assunto, mensagem, idUsuario, idAdministrador } = req.body;
    if (!nome || !email || !assunto || !mensagem || !idAdministrador) {
      return res.status(400).json({ mensagem: "Nome, e-mail, instituição, assunto e mensagem são obrigatórios." });
    }
    const contato = await criarContato({ nome, email, assunto, mensagem, idUsuario, idAdministrador: Number(idAdministrador) });
    return res.status(201).json({ mensagem: "Mensagem enviada com sucesso.", contato });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Erro ao enviar contato." });
  }
}
export async function remover(req: Request, res: Response) {
  try {
    await deletarContato(Number(req.params.id));
    return res.json({ mensagem: "Contato removido com sucesso." });
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Contato não encontrado." });
  }
}
export async function responder(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const resposta = String(req.body?.resposta || "").trim();
    if (!resposta)
      return res.status(400).json({ mensagem: "Digite uma resposta antes de enviar." });
    const resultado = await responderContato(Number(req.params.id), admin.idAdministrador, resposta);
    return res.json({ mensagem: "Resposta registrada com sucesso.", contato: resultado });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível responder à mensagem." });
  }
}
