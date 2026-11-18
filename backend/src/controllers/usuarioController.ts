import type { Request, Response } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware.js";
import { listarUsuarios, buscarUsuarioPorId, atualizarUsuario, atualizarTipoUsuario, deletarUsuario, deletarMinhaConta, } from "../services/usuarioService.js";
export async function listar(req: Request, res: Response) {
  try {
    const usuarios = await listarUsuarios();
    return res.json(usuarios);
  }
  catch (error) {
    return res.status(500).json({ mensagem: "Erro ao listar usuários." });
  }
}
export async function meuPerfil(req: RequestAutenticada, res: Response) {
  try {
    const usuario = await buscarUsuarioPorId(req.usuario!.id);
    return res.json(usuario);
  }
  catch (error) {
    return res.status(404).json({
      mensagem: error instanceof Error ? error.message : "Usuário não encontrado.",
    });
  }
}
export async function atualizarMeuPerfil(req: RequestAutenticada, res: Response) {
  try {
    const { nome, email, telefone, endereco } = req.body;
    const usuario = await atualizarUsuario(req.usuario!.id, {
      nome,
      email,
      telefone,
      endereco,
    });
    return res.json({
      mensagem: "Perfil atualizado com sucesso.",
      usuario,
    });
  }
  catch (error) {
    return res.status(400).json({
      mensagem: error instanceof Error ? error.message : "Erro ao atualizar perfil.",
    });
  }
}
export async function atualizarTipo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { tipo } = req.body;
    if (!tipo) {
      return res.status(400).json({ mensagem: "O tipo é obrigatório." });
    }
    const usuario = await atualizarTipoUsuario(id, tipo);
    return res.json({
      mensagem: "Tipo de usuário atualizado com sucesso.",
      usuario,
    });
  }
  catch (error) {
    return res.status(404).json({
      mensagem: error instanceof Error ? error.message : "Usuário não encontrado.",
    });
  }
}
export async function remover(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deletarUsuario(id);
    return res.json({ mensagem: "Usuário removido com sucesso." });
  }
  catch (error) {
    return res.status(404).json({
      mensagem: error instanceof Error ? error.message : "Usuário não encontrado.",
    });
  }
}
export async function excluirMeuPerfil(req: RequestAutenticada, res: Response) {
  try {
    await deletarMinhaConta(req.usuario!.id);
    return res.json({ mensagem: "Sua conta foi excluída com sucesso." });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível excluir a conta." });
  }
}
