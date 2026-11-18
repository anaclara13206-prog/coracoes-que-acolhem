import prisma from "../lib/prisma.js";
export async function listarContatos(idAdministrador?: number) {
  if (idAdministrador) {
    return prisma.$queryRaw`
      SELECT c.idcontato AS "idContato", c.nomecontato AS "nomeContato",
             c.emailcontato AS "emailContato", c.assuntocontato AS "assuntoContato",
             c.mensagemcontato AS "mensagemContato", c.datacontato AS "dataContato",
             c.idusuario AS "idUsuario", c.idadministrador AS "idAdministrador",
             c.respostacontato AS "respostaContato", c.dataresposta AS "dataResposta",
             a.nomeempresa AS "nomeEmpresa"
      FROM contato c
      LEFT JOIN administrador a ON a.idadministrador = c.idadministrador
      WHERE c.idadministrador = ${idAdministrador}
      ORDER BY c.datacontato DESC
    `;
  }
  return prisma.contato.findMany({ orderBy: { dataContato: "desc" } });
}
export async function listarContatosPorUsuario(idUsuario: number) {
  return prisma.contato.findMany({ where: { idUsuario }, orderBy: { dataContato: "desc" } });
}
export async function buscarContatoPorId(id: number) {
  const contato = await prisma.contato.findUnique({ where: { idContato: id } });
  if (!contato)
    throw new Error("Contato não encontrado.");
  return contato;
}
export async function criarContato(dados: {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  idUsuario?: number;
  idAdministrador?: number;
}) {
  const ultimo = await prisma.contato.findFirst({ orderBy: { idContato: "desc" } });
  const novoId = ultimo ? ultimo.idContato + 1 : 1;
  await prisma.$executeRaw`
    INSERT INTO contato (idcontato, nomecontato, emailcontato, assuntocontato, mensagemcontato, datacontato, idusuario, idadministrador)
    VALUES (${novoId}, ${dados.nome.trim()}, ${dados.email.trim().toLowerCase()}, ${dados.assunto.trim()}, ${dados.mensagem.trim()}, CURRENT_DATE, ${dados.idUsuario ?? null}, ${dados.idAdministrador ?? null})
  `;
  return prisma.$queryRaw`
    SELECT idcontato AS "idContato", nomecontato AS "nomeContato", emailcontato AS "emailContato",
           assuntocontato AS "assuntoContato", mensagemcontato AS "mensagemContato",
           datacontato AS "dataContato", idusuario AS "idUsuario", idadministrador AS "idAdministrador"
    FROM contato WHERE idcontato = ${novoId}
  `;
}
export async function deletarContato(id: number) {
  await buscarContatoPorId(id);
  return prisma.contato.delete({ where: { idContato: id } });
}
export async function responderContato(id: number, idAdministrador: number, resposta: string) {
  const atual = await prisma.$queryRaw<{
    idContato: number;
  }[]> `
    SELECT idcontato AS "idContato" FROM contato
    WHERE idcontato = ${id} AND idadministrador = ${idAdministrador}
  `;
  if (!atual[0])
    throw new Error("Mensagem não encontrada para sua instituição.");
  await prisma.$executeRaw`
    UPDATE contato SET respostacontato = ${resposta.trim()}, dataresposta = CURRENT_TIMESTAMP
    WHERE idcontato = ${id} AND idadministrador = ${idAdministrador}
  `;
  return prisma.$queryRaw`
    SELECT idcontato AS "idContato", respostacontato AS "respostaContato",
           dataresposta AS "dataResposta" FROM contato WHERE idcontato = ${id}
  `;
}
