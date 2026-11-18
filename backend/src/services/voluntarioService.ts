import prisma from "../lib/prisma.js";
export interface VoluntarioRegistro {
  idVoluntario: number;
  dataInscricao: Date;
  statusVoluntario: string;
  disponibilidade: string | null;
  motivacao: string | null;
  experiencia: string | null;
  idade: number | null;
  cidade: string | null;
  areaInteresse: string | null;
  idUsuario: number | null;
  idQuestionario: number | null;
  idAdministrador: number | null;
  dataInicio: Date | null;
  dataFim: Date | null;
  horarioInicio: string | null;
  horarioFim: string | null;
}
const selectSql = `v.idvoluntario AS "idVoluntario", v.datainscricao AS "dataInscricao", v.statusvoluntario AS "statusVoluntario",
v.disponibilidade, v.motivacao, v.experiencia, v.idade, v.cidade, v.areainteresse AS "areaInteresse", v.idusuario AS "idUsuario",
v.idquestionario AS "idQuestionario", v.idadministrador AS "idAdministrador", v.data_inicio AS "dataInicio", v.data_fim AS "dataFim",
v.horario_inicio AS "horarioInicio", v.horario_fim AS "horarioFim", a.nomeempresa AS "nomeEmpresa"`;
export async function listarVoluntarios(idAdministrador?: number) {
  if (idAdministrador)
    return prisma.$queryRawUnsafe<VoluntarioRegistro[]>(`SELECT ${selectSql} 
    FROM voluntario v LEFT JOIN administrador a ON a.idadministrador=v.idadministrador 
    WHERE v.idadministrador = $1 ORDER BY datainscricao DESC`, idAdministrador);
  return prisma.$queryRawUnsafe<VoluntarioRegistro[]>(`SELECT ${selectSql} 
    FROM voluntario v LEFT JOIN administrador a ON a.idadministrador=v.idadministrador ORDER BY v.datainscricao DESC`);
}
export async function buscarVoluntarioPorUsuario(idUsuario: number, idAdministrador?: number) {
  if (idAdministrador)
    return prisma.$queryRawUnsafe<VoluntarioRegistro[]>(`SELECT ${selectSql} 
    FROM voluntario v LEFT JOIN administrador a ON a.idadministrador=v.idadministrador 
    WHERE v.idusuario=$1 AND v.idadministrador=$2 ORDER BY datainscricao DESC`, idUsuario, idAdministrador);
  return prisma.$queryRawUnsafe<VoluntarioRegistro[]>(`SELECT ${selectSql} 
    FROM voluntario v LEFT JOIN administrador a ON a.idadministrador=v.idadministrador 
    WHERE v.idusuario=$1 ORDER BY v.datainscricao DESC`, idUsuario);
}
export async function buscarVoluntarioPorId(id: number) {
  const rows = await prisma.$queryRawUnsafe<VoluntarioRegistro[]>(`SELECT ${selectSql}
     FROM voluntario v LEFT JOIN administrador a ON a.idadministrador=v.idadministrador WHERE v.idvoluntario=$1 LIMIT 1`, id);
  if (!rows[0])
    throw new Error("Voluntário não encontrado.");
  return rows[0];
}
export async function inscreverVoluntario(dados: {
  disponibilidade?: string;
  motivacao?: string;
  experiencia?: string;
  idade?: number;
  cidade?: string;
  areaInteresse?: string;
  idUsuario: number;
  idAdministrador: number;
  idQuestionario?: number;
}) {
  const empresa = await prisma.$queryRaw<{
    idAdministrador: number;
  }[]> `SELECT idadministrador AS "idAdministrador" FROM administrador WHERE idadministrador=${dados.idAdministrador} LIMIT 1`;
  if (!empresa[0])
    throw new Error("Instituição parceira não encontrada.");
  const ultimo = await prisma.$queryRaw<{
    id: number;
  }[]> `SELECT COALESCE(MAX(idvoluntario),0)::int AS id FROM voluntario`;
  const id = (ultimo[0]?.id || 0) + 1;
  await prisma.$executeRaw`
    INSERT INTO voluntario (idvoluntario,datainscricao,statusvoluntario,disponibilidade,motivacao,experiencia,idade,cidade,
    areainteresse,idusuario,idadministrador,idquestionario)
    VALUES (${id},CURRENT_DATE,'pendente',${dados.disponibilidade || null},${dados.motivacao || null},${dados.experiencia || null},
    ${dados.idade ?? null},${dados.cidade || null},${dados.areaInteresse || null},${dados.idUsuario},${dados.idAdministrador},${dados.idQuestionario ?? null})`;
  return buscarVoluntarioPorId(id);
}
export async function atualizarStatusVoluntario(id: number, status: string, idAdministrador?: number) {
  const atual = await buscarVoluntarioPorId(id);
  if (idAdministrador && atual.idAdministrador !== idAdministrador)
    throw new Error("Voluntário não pertence à sua instituição.");
  const inicio = status.toLowerCase() === "aprovado" ? "CURRENT_DATE" : "data_inicio";
  await prisma.$executeRawUnsafe(`UPDATE voluntario SET statusvoluntario=$1, data_inicio=${inicio} WHERE idvoluntario=$2`, status, id);
  return buscarVoluntarioPorId(id);
}
export async function finalizarVoluntario(id: number, idAdministrador?: number) {
  const atual = await buscarVoluntarioPorId(id);
  if (idAdministrador && atual.idAdministrador !== idAdministrador)
    throw new Error("Voluntário não pertence à sua instituição.");
  await prisma.$executeRaw`UPDATE voluntario SET statusvoluntario='finalizado', data_fim=CURRENT_DATE WHERE idvoluntario=${id}`;
  return buscarVoluntarioPorId(id);
}
export async function deletarVoluntario(id: number, idAdministrador?: number) {
  const atual = await buscarVoluntarioPorId(id);
  if (idAdministrador && atual.idAdministrador !== idAdministrador)
    throw new Error("Voluntário não pertence à sua instituição.");
  await prisma.$executeRaw`DELETE FROM voluntario_presenca WHERE idvoluntario=${id}`;
  await prisma.$executeRaw`DELETE FROM voluntario WHERE idvoluntario=${id}`;
}
export async function listarPresencas(idVoluntario: number) {
  return prisma.$queryRaw`
    SELECT idpresenca AS "idPresenca", idvoluntario AS "idVoluntario", datapresenca AS "dataPresenca",
           horainicio AS "horaInicio", horafim AS "horaFim", status, observacao
    FROM voluntario_presenca WHERE idvoluntario=${idVoluntario} ORDER BY datapresenca DESC
  `;
}
export async function registrarPresenca(idVoluntario: number, dados: {
  data: string;
  horaInicio?: string;
  horaFim?: string;
  status: string;
  observacao?: string;
}, idAdministrador: number) {
  const atual = await buscarVoluntarioPorId(idVoluntario);
  if (atual.idAdministrador !== idAdministrador)
    throw new Error("Voluntário não pertence à sua instituição.");
  return prisma.$queryRaw`
    INSERT INTO voluntario_presenca (idvoluntario,datapresenca,horainicio,horafim,status,observacao)
    VALUES (${idVoluntario},${dados.data},${dados.horaInicio || null},${dados.horaFim || null},${dados.status},${dados.observacao || null})
    RETURNING idpresenca AS "idPresenca", idvoluntario AS "idVoluntario", datapresenca AS "dataPresenca",
      horainicio AS "horaInicio", horafim AS "horaFim", status, observacao
  `;
}
