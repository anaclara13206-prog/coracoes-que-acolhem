import prisma from "../lib/prisma.js";
export async function listarInformacoes(idAdministrador?: number) {
  if (idAdministrador) {
    return prisma.$queryRaw`
      SELECT idinformacao AS "idInformacao", tituloinformacao AS "tituloInformacao",
        conteudoinformacao AS "conteudoInformacao", fonteinformacao AS "fonteInformacao",
        datapublicacao AS "dataPublicacao", idadministrador AS "idAdministrador",
        categoria, imagemurl AS "imagemUrl"
      FROM informacao WHERE idadministrador=${idAdministrador} ORDER BY datapublicacao DESC
    `;
  }
  return prisma.informacao.findMany({ orderBy: { dataPublicacao: "desc" } });
}
export async function buscarInformacaoPorId(id: number) {
  const info = await prisma.informacao.findUnique({ where: { idInformacao: id } });
  if (!info)
    throw new Error("Informação não encontrada.");
  return info;
}
export async function criarInformacao(dados: {
  titulo: string;
  conteudo: string;
  fonte?: string;
  categoria?: string;
  imagemUrl?: string;
  idAdministrador: number;
}) {
  const ultimo = await prisma.$queryRaw<{
    id: number;
  }[]> `SELECT COALESCE(MAX(idinformacao),0)::int AS id FROM informacao`;
  const id = (ultimo[0]?.id || 0) + 1;
  await prisma.$executeRaw`
    INSERT INTO informacao (idinformacao,tituloinformacao,conteudoinformacao,fonteinformacao,datapublicacao,idadministrador,categoria,imagemurl)
    VALUES (${id},${dados.titulo},${dados.conteudo},${dados.fonte || null},CURRENT_DATE,${dados.idAdministrador},${dados.categoria || null},${dados.imagemUrl || null})
  `;
  return buscarInformacaoPorId(id);
}
export async function atualizarInformacao(id: number, dados: {
  titulo?: string;
  conteudo?: string;
  fonte?: string;
  categoria?: string;
  imagemUrl?: string;
}, idAdministrador: number) {
  const rows = await prisma.$queryRaw<{
    id: number;
  }[]> `SELECT idinformacao AS id FROM informacao WHERE idinformacao=${id} AND idadministrador=${idAdministrador}`;
  if (!rows[0])
    throw new Error("Informação não encontrada para sua instituição.");
  await prisma.$executeRaw`
    UPDATE informacao SET tituloinformacao=COALESCE(${dados.titulo ?? null},tituloinformacao),
      conteudoinformacao=COALESCE(${dados.conteudo ?? null},conteudoinformacao),
      fonteinformacao=COALESCE(${dados.fonte ?? null},fonteinformacao),
      categoria=COALESCE(${dados.categoria ?? null},categoria),
      imagemurl=COALESCE(${dados.imagemUrl ?? null},imagemurl)
    WHERE idinformacao=${id}
  `;
  return buscarInformacaoPorId(id);
}
export async function deletarInformacao(id: number, idAdministrador: number) {
  const rows = await prisma.$queryRaw<{
    id: number;
  }[]> `SELECT idinformacao AS id FROM informacao WHERE idinformacao=${id} AND idadministrador=${idAdministrador}`;
  if (!rows[0])
    throw new Error("Informação não encontrada para sua instituição.");
  await prisma.$executeRaw`DELETE FROM informacao WHERE idinformacao=${id}`;
}
