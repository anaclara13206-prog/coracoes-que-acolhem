import type { Request, Response } from "express";
import { cadastrarUsuario, cadastrarInstituicao, realizarLogin, solicitarRedefinicaoSenha, redefinirSenha } from "../services/authService.js";
export async function cadastro(req: Request, res: Response) {
  try {
    const { nome, email, senha, telefone } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    const usuario = await cadastrarUsuario(nome, email, senha, telefone);
    return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso.", usuario });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Erro ao cadastrar usuário." });
  }
}
export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    const resultado = await realizarLogin(email, senha);
    return res.status(200).json({ mensagem: "Login realizado com sucesso.", ...resultado });
  }
  catch (error) {
    return res.status(401).json({ mensagem: error instanceof Error ? error.message : "Erro ao realizar login." });
  }
}
export async function cadastroInstituicao(req: Request, res: Response) {
  try {
    const { nomeEmpresa, cnpjEmpresa, cidadeEmpresa, telefoneEmpresa, emailEmpresa, senha, descricaoEmpresa } = req.body;
    const administrador = await cadastrarInstituicao({ nomeEmpresa, cnpjEmpresa, cidadeEmpresa, telefoneEmpresa, emailEmpresa, senha, descricaoEmpresa });
    return res.status(201).json({ mensagem: "Instituição cadastrada com sucesso. Agora você já pode entrar.", administrador });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível cadastrar a instituição." });
  }
}
export async function solicitarSenha(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ mensagem: "Informe o e-mail cadastrado." });
    const resultado = await solicitarRedefinicaoSenha(email);
    return res.json({
      mensagem: "Se o e-mail estiver cadastrado, as instruções de recuperação foram preparadas.",
      link: resultado.link,
    });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível iniciar a recuperação." });
  }
}
export async function redefinir(req: Request, res: Response) {
  try {
    const { token, novaSenha } = req.body;
    await redefinirSenha(token, novaSenha);
    return res.json({ mensagem: "Senha alterada com sucesso. Você já pode entrar com a nova senha." });
  }
  catch (error) {
    return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível alterar a senha." });
  }
}
