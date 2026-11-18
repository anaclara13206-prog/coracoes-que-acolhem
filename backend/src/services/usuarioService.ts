import prisma from "../lib/prisma.js";
const selecaoPublica = {
  idUsuario: true,
  nomeUsuario: true,
  emailUsuario: true,
  tipoUsuario: true,
  telefoneUsuario: true,
  enderecoUsuario: true,
};
export async function listarUsuarios() {
  return prisma.usuario.findMany({
    select: selecaoPublica,
    orderBy: { idUsuario: "desc" },
  });
}
export async function buscarUsuarioPorId(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { idUsuario: id },
    select: selecaoPublica,
  });
  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }
  return usuario;
}
export async function atualizarUsuario(id: number, dados: {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}) {
  await buscarUsuarioPorId(id);
  const telefone = dados.telefone ? String(dados.telefone).replace(/\D/g, "") : "";
  const email = dados.email ? String(dados.email).trim().toLowerCase() : undefined;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Informe um e-mail válido.");
  if (email) {
    const existente = await prisma.usuario.findFirst({ where: { emailUsuario: email, NOT: { idUsuario: id } } });
    if (existente)
      throw new Error("Este e-mail já está sendo utilizado por outra conta.");
  }
  if (telefone && !/^\d{8,15}$/.test(telefone)) {
    throw new Error("O telefone deve conter apenas números (8 a 15 dígitos).");
  }
  return prisma.usuario.update({
    where: { idUsuario: id },
    data: {
      nomeUsuario: dados.nome,
      emailUsuario: email,
      telefoneUsuario: telefone || undefined,
      enderecoUsuario: dados.endereco,
    },
    select: selecaoPublica,
  });
}
export async function atualizarTipoUsuario(id: number, tipo: string) {
  await buscarUsuarioPorId(id);
  return prisma.usuario.update({
    where: { idUsuario: id },
    data: { tipoUsuario: tipo },
    select: selecaoPublica,
  });
}
export async function deletarUsuario(id: number) {
  await buscarUsuarioPorId(id);
  return prisma.usuario.delete({
    where: { idUsuario: id },
  });
}
export async function deletarMinhaConta(id: number) {
  const usuario = await prisma.usuario.findUnique({ where: { idUsuario: id } });
  if (!usuario)
    throw new Error("Usuário não encontrado.");
  if (usuario.tipoUsuario === "administrador") {
    throw new Error("Para excluir uma instituição, entre em contato com o suporte. Esta opção é destinada a contas de participantes.");
  }
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`DELETE FROM voluntario_presenca WHERE idvoluntario IN (SELECT idvoluntario FROM voluntario WHERE idusuario = ${id})`;
    await tx.$executeRaw`DELETE FROM questionario WHERE idusuario = ${id}`;
    await tx.$executeRaw`DELETE FROM contato WHERE idusuario = ${id}`;
    await tx.$executeRaw`DELETE FROM doacao WHERE idusuario = ${id}`;
    await tx.$executeRaw`DELETE FROM voluntario WHERE idusuario = ${id}`;
    await tx.$executeRaw`DELETE FROM senha_reset WHERE idusuario = ${id}`;
    await tx.usuario.delete({ where: { idUsuario: id } });
  });
}
