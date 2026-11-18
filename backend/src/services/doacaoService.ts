import prisma from "../lib/prisma.js";
export async function listarDoacoes(idAdministrador?: number) {
  if (idAdministrador) {
    return prisma.$queryRaw`
      SELECT d.iddoacao AS "idDoacao", d.valordoacao AS "valorDoacao",
             d.datadoacao AS "dataDoacao", d.tipodoacao AS "tipoDoacao",
             d.tipopagamentodoacao AS "tipoPagamentoDoacao", d.descricaodoacao AS "descricaoDoacao",
             d.idusuario AS "idUsuario", d.idadministrador AS "idAdministrador",
             COALESCE(d.statusdoacao, 'Pendente de confirmação') AS "statusDoacao", d.comprovanteurl AS "comprovanteUrl", d.motivorecusa AS "motivoRecusa",
             u.nomeusuario AS "nomeUsuario", u.emailusuario AS "emailUsuario"
      FROM doacao d LEFT JOIN usuario u ON u.idusuario = d.idusuario
      WHERE d.idadministrador = ${idAdministrador}
      ORDER BY d.datadoacao DESC, d.iddoacao DESC
    `;
  }
  return prisma.$queryRaw`
    SELECT d.iddoacao AS "idDoacao", d.valordoacao AS "valorDoacao",
           d.datadoacao AS "dataDoacao", d.tipodoacao AS "tipoDoacao",
           d.tipopagamentodoacao AS "tipoPagamentoDoacao", d.descricaodoacao AS "descricaoDoacao",
           d.idusuario AS "idUsuario", d.idadministrador AS "idAdministrador",
           COALESCE(d.statusdoacao, 'Pendente de confirmação') AS "statusDoacao", d.comprovanteurl AS "comprovanteUrl", d.motivorecusa AS "motivoRecusa"
    FROM doacao d ORDER BY d.datadoacao DESC, d.iddoacao DESC
  `;
}
export async function listarDoacoesPorUsuario(idUsuario: number) {
  return prisma.$queryRaw`
    SELECT d.iddoacao AS "idDoacao", d.valordoacao AS "valorDoacao", d.datadoacao AS "dataDoacao",
           d.tipodoacao AS "tipoDoacao", d.tipopagamentodoacao AS "tipoPagamentoDoacao",
           d.descricaodoacao AS "descricaoDoacao", d.idusuario AS "idUsuario",
           d.idadministrador AS "idAdministrador",
           COALESCE(d.statusdoacao, 'Pendente de confirmação') AS "statusDoacao", d.motivorecusa AS "motivoRecusa",
           a.nomeempresa AS "nomeEmpresa"
    FROM doacao d LEFT JOIN administrador a ON a.idadministrador = d.idadministrador
    WHERE d.idusuario = ${idUsuario} ORDER BY d.datadoacao DESC, d.iddoacao DESC
  `;
}
export async function buscarDoacaoPorId(id: number) {
  const doacoes = await prisma.$queryRaw<any[]> `
    SELECT iddoacao AS "idDoacao", valordoacao AS "valorDoacao", datadoacao AS "dataDoacao",
           tipodoacao AS "tipoDoacao", tipopagamentodoacao AS "tipoPagamentoDoacao",
           descricaodoacao AS "descricaoDoacao", idusuario AS "idUsuario",
           idadministrador AS "idAdministrador",
           COALESCE(statusdoacao, 'Pendente de confirmação') AS "statusDoacao", comprovanteurl AS "comprovanteUrl", motivorecusa AS "motivoRecusa"
    FROM doacao WHERE iddoacao = ${id} LIMIT 1
  `;
  if (!doacoes[0])
    throw new Error("Doação não encontrada.");
  return doacoes[0];
}
export async function criarDoacao(dados: {
  valor?: number;
  tipoDoacao: string;
  tipoPagamento?: string;
  descricao?: string;
  idUsuario?: number;
  idAdministrador: number;
  comprovanteUrl?: string;
}) {
  const ultimo = await prisma.$queryRaw<{
    id: number;
  }[]> `
    SELECT COALESCE(MAX(iddoacao), 0)::int AS id FROM doacao
  `;
  const novoId = (ultimo[0]?.id || 0) + 1;
  await prisma.$executeRaw`
    INSERT INTO doacao
      (iddoacao, valordoacao, tipodoacao, tipopagamentodoacao, descricaodoacao,
       datadoacao, idusuario, idadministrador, statusdoacao, comprovanteurl)
    VALUES (${novoId}, ${dados.valor ?? null}, ${dados.tipoDoacao}, ${dados.tipoPagamento ?? null},
            ${dados.descricao ?? null}, CURRENT_DATE, ${dados.idUsuario ?? null},
            ${dados.idAdministrador}, 'Pendente de confirmação', ${dados.comprovanteUrl ?? null})
  `;
  return buscarDoacaoPorId(novoId);
}
export async function confirmarDoacao(id: number, idAdministrador: number) {
  const rows = await prisma.$queryRaw<{
    iddoacao: number;
  }[]> `
    UPDATE doacao SET statusdoacao = 'Confirmada'
    WHERE iddoacao = ${id} AND idadministrador = ${idAdministrador}
    RETURNING iddoacao
  `;
  if (!rows[0])
    throw new Error("Doação não encontrada para esta instituição.");
  return buscarDoacaoPorId(id);
}
export async function deletarDoacao(id: number) {
  await buscarDoacaoPorId(id);
  return prisma.doacao.delete({ where: { idDoacao: id } });
}
export async function recusarDoacao(id: number, idAdministrador: number, motivo: string) {
  const rows = await prisma.$queryRaw<{
    idDoacao: number;
  }[]> `
    UPDATE doacao SET statusdoacao='Recusada', motivorecusa=${motivo}
    WHERE iddoacao=${id} AND idadministrador=${idAdministrador} RETURNING iddoacao AS "idDoacao"`;
  if (!rows[0])
    throw new Error("Doação não encontrada para esta instituição.");
  return buscarDoacaoPorId(id);
}
