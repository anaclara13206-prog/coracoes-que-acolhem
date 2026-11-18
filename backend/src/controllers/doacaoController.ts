import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { listarDoacoes, listarDoacoesPorUsuario, buscarDoacaoPorId, criarDoacao, confirmarDoacao, recusarDoacao, deletarDoacao } from "../services/doacaoService.js";
import { buscarAdministradorPorUsuario } from "../services/administradorService.js";
export async function listar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(await listarDoacoes(admin.idAdministrador));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar doações." });
  }
}
export async function listarMinhas(req: RequestAutenticada, res: Response) {
  try {
    return res.json(await listarDoacoesPorUsuario(req.usuario!.id));
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar suas doações." });
  }
}
export async function buscarPorId(req: Request, res: Response) {
  try {
    return res.json(await buscarDoacaoPorId(Number(req.params.id)));
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Doação não encontrada." });
  }
}
export async function criar(req: RequestAutenticada, res: Response) {
  try {
    const { valor, tipoDoacao, tipoPagamento, descricao, idAdministrador, comprovanteUrl } = req.body;
    if (!tipoDoacao || !idAdministrador)
      return res.status(400).json({ mensagem: "Tipo de doação e instituição são obrigatórios." });
    if (tipoDoacao === "Dinheiro") {
      if (!Number.isFinite(Number(valor)) || Number(valor) <= 0)
        return res.status(400).json({ mensagem: "Informe um valor de doação maior que zero." });
      if (!["Pix", "Transferência", "Outro"].includes(String(tipoPagamento)))
        return res.status(400).json({ mensagem: "Selecione uma forma de pagamento válida." });
    }
    const doacao = await criarDoacao({
      valor: valor ? Number(valor) : undefined, tipoDoacao, tipoPagamento, descricao, idUsuario: req.usuario!.id, idAdministrador: Number(idAdministrador), comprovanteUrl: typeof comprovanteUrl === "string" ? comprovanteUrl : undefined
    });
    return res.status(201).json({ mensagem: "Doação registrada com sucesso.", doacao });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Erro ao registrar doação." });
  }
}
export async function remover(req: Request, res: Response) {
  try {
    await deletarDoacao(Number(req.params.id));
    return res.json({ mensagem: "Doação removida com sucesso." });
  }
  catch (error) {
    return res.status(404).json({ mensagem: error instanceof Error ? error.message : "Doação não encontrada." });
  }
}
export async function recusar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const { motivo } = req.body;
    if (!motivo || !String(motivo).trim())
      return res.status(400).json({ mensagem: "Informe o motivo da recusa." });
    const doacao = await recusarDoacao(Number(req.params.id), admin.idAdministrador, String(motivo).trim());
    return res.json({ mensagem: "Doação recusada.", doacao });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível recusar a doação." });
  }
}
export async function confirmar(req: RequestAutenticada, res: Response) {
  try {
    const admin = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!admin)
      return res.status(403).json({ mensagem: "Administrador sem instituição vinculada." });
    const doacao = await confirmarDoacao(Number(req.params.id), admin.idAdministrador);
    return res.json({ mensagem: "Recebimento confirmado pela instituição.", doacao });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível confirmar a doação." });
  }
}
