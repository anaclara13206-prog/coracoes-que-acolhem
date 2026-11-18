import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { listarAdministradoresPublicos, buscarAdministradorPorUsuario, atualizarMinhaInstituicao } from "../services/administradorService.js";
export async function listarPublicos(_req: Request, res: Response) {
  try {
    return res.json(await listarAdministradoresPublicos());
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao listar instituições parceiras." });
  }
}
export async function minhaEmpresa(req: RequestAutenticada, res: Response) {
  try {
    const administrador = await buscarAdministradorPorUsuario(req.usuario!.id);
    if (!administrador)
      return res.status(404).json({ mensagem: "Administrador sem instituição vinculada." });
    return res.json(administrador);
  }
  catch {
    return res.status(500).json({ mensagem: "Erro ao buscar instituição do administrador." });
  }
}
export async function atualizarMinhaEmpresa(req: RequestAutenticada, res: Response) {
  try {
    const { nomeEmpresa, cidadeEmpresa, telefoneEmpresa, emailEmpresa, cnpjEmpresa, descricaoEmpresa, chavePix, dadosBancarios } = req.body;
    if (!nomeEmpresa?.trim())
      return res.status(400).json({ mensagem: "O nome da instituição é obrigatório." });
    if (cnpjEmpresa && !/^\d{14}$/.test(String(cnpjEmpresa).replace(/\D/g, "")))
      return res.status(400).json({ mensagem: "O CNPJ deve conter 14 números." });
    const administrador = await atualizarMinhaInstituicao(req.usuario!.id, {
      nomeEmpresa, cidadeEmpresa, telefoneEmpresa, emailEmpresa, cnpjEmpresa: String(cnpjEmpresa || "").replace(/\D/g, ""), descricaoEmpresa, chavePix, dadosBancarios
    });
    return res.json({ mensagem: "Dados da instituição atualizados com sucesso.", administrador });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível atualizar a instituição." });
  }
}
