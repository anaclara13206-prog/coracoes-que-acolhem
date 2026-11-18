import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import prisma from "../lib/prisma.js";
function validarTelefone(telefone?: string) {
  if (telefone && !/^\d{8,15}$/.test(telefone)) {
    throw new Error("O telefone deve conter apenas números (8 a 15 dígitos).");
  }
}
function gerarToken(usuario: {
  idUsuario: number;
  emailUsuario: string;
}) {
  const segredo = process.env.JWT_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error("JWT_SECRET precisa estar definido e conter pelo menos 32 caracteres.");
  }
  return jwt.sign({ id: usuario.idUsuario, email: usuario.emailUsuario }, segredo, { expiresIn: "1h" });
}
export async function cadastrarUsuario(nome: string, email: string, senha: string, telefone?: string) {
  const nomeLimpo = String(nome).trim();
  const emailLimpo = String(email).trim().toLowerCase();
  const telefoneLimpo = telefone ? String(telefone).replace(/\D/g, "") : "";
  if (!nomeLimpo || !emailLimpo || !senha)
    throw new Error("Nome, e-mail e senha são obrigatórios.");
  if (senha.length > 20)
    throw new Error("A senha deve ter no máximo 20 caracteres.");
  validarTelefone(telefoneLimpo || undefined);
  const usuarioExistente = await prisma.usuario.findFirst({ where: { emailUsuario: emailLimpo } });
  if (usuarioExistente)
    throw new Error("E-mail já cadastrado.");
  const ultimoUsuario = await prisma.usuario.findFirst({ orderBy: { idUsuario: "desc" } });
  const novoId = ultimoUsuario ? ultimoUsuario.idUsuario + 1 : 1;
  const usuario = await prisma.usuario.create({
    data: {
      idUsuario: novoId,
      nomeUsuario: nomeLimpo,
      emailUsuario: emailLimpo,
      senhaUsuario: await bcrypt.hash(senha, 12),
      tipoUsuario: "usuario",
      telefoneUsuario: telefoneLimpo || undefined,
    },
  });
  return {
    id: usuario.idUsuario,
    nome: usuario.nomeUsuario,
    email: usuario.emailUsuario,
    tipo: usuario.tipoUsuario || "usuario",
    telefone: usuario.telefoneUsuario || "",
  };
}
export async function realizarLogin(email: string, senha: string) {
  const emailLimpo = String(email).trim().toLowerCase();
  const usuario = await prisma.usuario.findFirst({ where: { emailUsuario: emailLimpo } });
  if (!usuario)
    throw new Error("E-mail ou senha inválidos.");
  const senhaHashValida = await bcrypt.compare(senha, usuario.senhaUsuario).catch(() => false);
  if (!senhaHashValida) {
    throw new Error("E-mail ou senha inválidos. Se esta conta for antiga, utilize a recuperação de senha.");
  }
  return {
    usuario: {
      id: usuario.idUsuario,
      nome: usuario.nomeUsuario,
      email: usuario.emailUsuario,
      tipo: usuario.tipoUsuario || "usuario",
      telefone: usuario.telefoneUsuario || "",
    },
    token: gerarToken(usuario),
  };
}
export async function cadastrarInstituicao(dados: {
  nomeEmpresa: string;
  cnpjEmpresa: string;
  cidadeEmpresa?: string;
  telefoneEmpresa?: string;
  emailEmpresa: string;
  senha: string;
  descricaoEmpresa?: string;
}) {
  const nomeEmpresa = dados.nomeEmpresa.trim();
  const email = dados.emailEmpresa.trim().toLowerCase();
  const cnpj = String(dados.cnpjEmpresa || "").replace(/\D/g, "");
  const telefone = dados.telefoneEmpresa ? dados.telefoneEmpresa.replace(/\D/g, "") : "";
  if (!nomeEmpresa || !email || !dados.senha || !cnpj)
    throw new Error("Nome, CNPJ, e-mail e senha são obrigatórios.");
  if (!/^\d{14}$/.test(cnpj))
    throw new Error("O CNPJ deve conter exatamente 14 números.");
  const cnpjExistente = await prisma.$queryRaw<{
    idAdministrador: number;
  }[]> `SELECT idadministrador AS "idAdministrador" FROM administrador WHERE cnpjempresa = ${cnpj} LIMIT 1`;
  if (cnpjExistente.length)
    throw new Error("Este CNPJ já está cadastrado.");
  if (dados.senha.length > 20 || dados.senha.length < 6)
    throw new Error("A senha deve ter entre 6 e 20 caracteres.");
  validarTelefone(telefone || undefined);
  const existente = await prisma.usuario.findFirst({ where: { emailUsuario: email } });
  if (existente)
    throw new Error("Já existe uma conta com este e-mail.");
  const ultimo = await prisma.usuario.findFirst({ orderBy: { idUsuario: "desc" } });
  const idUsuario = (ultimo?.idUsuario || 0) + 1;
  const usuario = await prisma.usuario.create({
    data: { idUsuario, nomeUsuario: nomeEmpresa, emailUsuario: email, senhaUsuario: await bcrypt.hash(dados.senha, 12), tipoUsuario: "administrador", telefoneUsuario: telefone || undefined }
  });
  const adminRows = await prisma.$queryRaw<{
    id: number;
  }[]> `SELECT COALESCE(MAX(idadministrador),0)::int AS id FROM administrador`;
  const idAdministrador = (adminRows[0]?.id || 0) + 1;
  await prisma.$executeRaw`
    INSERT INTO administrador (idadministrador,idusuario,nomeempresa,cnpjempresa,cidadeempresa,telefoneempresa,emailempresa,descricaoempresa)
    VALUES (${idAdministrador},${idUsuario},${nomeEmpresa},${cnpj},${dados.cidadeEmpresa?.trim() || null},${telefone || null},${email},${dados.descricaoEmpresa?.trim() || null})
  `;
  return { idAdministrador, idUsuario, nomeEmpresa, cnpj, email };
}
export async function solicitarRedefinicaoSenha(email: string) {
  const emailLimpo = String(email).trim().toLowerCase();
  const usuario = await prisma.usuario.findFirst({ where: { emailUsuario: emailLimpo } });
  // Resposta genérica evita revelar se o e-mail existe.
  if (!usuario)
    return { encontrado: false, link: null };
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.$executeRaw`
    DELETE FROM senha_reset WHERE idusuario = ${usuario.idUsuario} OR expiraem < NOW()
  `;
  await prisma.$executeRaw`
    INSERT INTO senha_reset (idusuario, token, expiraem)
    VALUES (${usuario.idUsuario}, ${token}, NOW() + INTERVAL '30 minutes')
  `;
  const base = process.env.FRONTEND_URL || "http://localhost:3000";
  return {
    encontrado: true,
    // Para o TCC funcionar sem serviço de e-mail externo, o link é devolvido somente fora de produção.
    link: process.env.NODE_ENV === "production" ? null : `${base}/redefinir-senha?token=${token}`,
  };
}
export async function redefinirSenha(token: string, novaSenha: string) {
  if (!token)
    throw new Error("Token de recuperação inválido.");
  if (!novaSenha || novaSenha.length < 6 || novaSenha.length > 20) {
    throw new Error("A nova senha deve ter entre 6 e 20 caracteres.");
  }
  const registros = await prisma.$queryRaw<{
    idreset: number;
    idusuario: number;
  }[]> `
    SELECT idreset, idusuario
    FROM senha_reset
    WHERE token = ${token}
      AND usadoem IS NULL
      AND expiraem > NOW()
    LIMIT 1
  `;
  if (!registros[0])
    throw new Error("O link de recuperação é inválido ou expirou.");
  await prisma.$transaction(async (tx) => {
    await tx.usuario.update({
      where: { idUsuario: registros[0].idusuario },
      data: { senhaUsuario: await bcrypt.hash(novaSenha, 12) },
    });
    await tx.$executeRaw`UPDATE senha_reset SET usadoem = NOW() WHERE idreset = ${registros[0].idreset}`;
  });
  return true;
}
