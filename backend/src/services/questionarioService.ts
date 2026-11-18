import prisma from "../lib/prisma.js";
export async function criarQuestionario(dados: {
  idUsuario: number;
  idAdministrador: number;
  idVoluntario?: number;
  respostas: Record<string, string>;
}) {
  const ultimo = await prisma.$queryRaw<{
    id: number;
  }[]> `SELECT COALESCE(MAX(idquestionario),0)::int AS id FROM questionario`;
  const id = (ultimo[0]?.id || 0) + 1;
  await prisma.$executeRaw`
    INSERT INTO questionario (idquestionario,respostasquestionario,dataenvioquestionario,statusquestionario,idusuario,idadministrador,idvoluntario)
    VALUES (${id},${JSON.stringify(dados.respostas)},CURRENT_DATE,'pendente',${dados.idUsuario},${dados.idAdministrador},${dados.idVoluntario ?? null})
  `;
  return prisma.$queryRaw`
    SELECT idquestionario AS "idQuestionario", respostasquestionario AS "respostasQuestionario",
      dataenvioquestionario AS "dataEnvioQuestionario", statusquestionario AS "statusQuestionario",
      idusuario AS "idUsuario", idadministrador AS "idAdministrador", idvoluntario AS "idVoluntario"
    FROM questionario WHERE idquestionario=${id}
  `;
}
export async function listarQuestionariosDoUsuario(idUsuario: number) {
  return prisma.$queryRaw`
    SELECT q.idquestionario AS "idQuestionario", q.respostasquestionario AS "respostasQuestionario",
      q.dataenvioquestionario AS "dataEnvioQuestionario", q.statusquestionario AS "statusQuestionario",
      q.idusuario AS "idUsuario", q.idadministrador AS "idAdministrador", q.idvoluntario AS "idVoluntario",
      a.nomeempresa AS "nomeEmpresa"
    FROM questionario q LEFT JOIN administrador a ON a.idadministrador=q.idadministrador
    WHERE q.idusuario=${idUsuario} ORDER BY q.dataenvioquestionario DESC
  `;
}
export async function listarQuestionariosDaInstituicao(idAdministrador: number) {
  return prisma.$queryRaw`
    SELECT q.idquestionario AS "idQuestionario", q.respostasquestionario AS "respostasQuestionario",
      q.dataenvioquestionario AS "dataEnvioQuestionario", q.statusquestionario AS "statusQuestionario",
      q.idusuario AS "idUsuario", q.idadministrador AS "idAdministrador", q.idvoluntario AS "idVoluntario",
      u.nomeusuario AS "nomeUsuario", u.emailusuario AS "emailUsuario", u.telefoneusuario AS "telefoneUsuario"
    FROM questionario q
    LEFT JOIN usuario u ON u.idusuario=q.idusuario
    WHERE q.idadministrador=${idAdministrador} ORDER BY q.dataenvioquestionario DESC
  `;
}
export async function atualizarStatusQuestionario(id: number, status: string, idAdministrador: number) {
  const rows = await prisma.$queryRaw<{
    idQuestionario: number;
  }[]> `
    SELECT idquestionario AS "idQuestionario" FROM questionario WHERE idquestionario=${id} AND idadministrador=${idAdministrador}
  `;
  if (!rows[0])
    throw new Error("Questionário não encontrado para sua instituição.");
  return prisma.$queryRaw`
    UPDATE questionario SET statusquestionario=${status}
    WHERE idquestionario=${id}
    RETURNING idquestionario AS "idQuestionario", respostasquestionario AS "respostasQuestionario",
      dataenvioquestionario AS "dataEnvioQuestionario", statusquestionario AS "statusQuestionario",
      idusuario AS "idUsuario", idadministrador AS "idAdministrador", idvoluntario AS "idVoluntario"
  `;
}
