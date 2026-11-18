import prisma from "../lib/prisma.js";
export interface EmpresaPublica {
  idAdministrador: number;
  nomeEmpresa: string | null;
  cidadeEmpresa: string | null;
  descricaoEmpresa: string | null;
  chavePix: string | null;
  dadosBancarios: string | null;
  emailEmpresa: string | null;
  cnpjEmpresa: string | null;
}
export interface AdministradorEmpresa extends EmpresaPublica {
  idUsuario: number | null;
  telefoneEmpresa: string | null;
}
export async function listarAdministradoresPublicos() {
  return prisma.$queryRaw<EmpresaPublica[]> `
    SELECT idadministrador AS "idAdministrador", nomeempresa AS "nomeEmpresa",
           cidadeempresa AS "cidadeEmpresa", descricaoempresa AS "descricaoEmpresa",
           chavepix AS "chavePix", dadosbancarios AS "dadosBancarios", emailempresa AS "emailEmpresa", cnpjempresa AS "cnpjEmpresa"
    FROM administrador ORDER BY idadministrador ASC
  `;
}
export async function buscarAdministradorPorUsuario(idUsuario: number) {
  const registros = await prisma.$queryRaw<AdministradorEmpresa[]> `
    SELECT idadministrador AS "idAdministrador", idusuario AS "idUsuario",
           nomeempresa AS "nomeEmpresa", cidadeempresa AS "cidadeEmpresa",
           telefoneempresa AS "telefoneEmpresa", emailempresa AS "emailEmpresa", cnpjempresa AS "cnpjEmpresa",
           descricaoempresa AS "descricaoEmpresa", chavepix AS "chavePix",
           dadosbancarios AS "dadosBancarios"
    FROM administrador WHERE idusuario = ${idUsuario} LIMIT 1
  `;
  return registros[0] || null;
}
export async function atualizarMinhaInstituicao(idUsuario: number, dados: {
  nomeEmpresa?: string;
  cidadeEmpresa?: string;
  telefoneEmpresa?: string;
  emailEmpresa?: string;
  cnpjEmpresa?: string;
  descricaoEmpresa?: string;
  chavePix?: string;
  dadosBancarios?: string;
}) {
  const administrador = await buscarAdministradorPorUsuario(idUsuario);
  if (!administrador)
    throw new Error("Administrador sem instituição vinculada.");
  const registros = await prisma.$queryRaw<AdministradorEmpresa[]> `
    UPDATE administrador SET
      nomeempresa = ${dados.nomeEmpresa?.trim() || null},
      cidadeempresa = ${dados.cidadeEmpresa?.trim() || null},
      telefoneempresa = ${dados.telefoneEmpresa?.trim() || null},
      emailempresa = ${dados.emailEmpresa?.trim() || null},
      cnpjempresa = ${dados.cnpjEmpresa?.replace(/\D/g, "") || null},
      descricaoempresa = ${dados.descricaoEmpresa?.trim() || null},
      chavepix = ${dados.chavePix?.trim() || null},
      dadosbancarios = ${dados.dadosBancarios?.trim() || null}
    WHERE idadministrador = ${administrador.idAdministrador}
    RETURNING idadministrador AS "idAdministrador", idusuario AS "idUsuario",
      nomeempresa AS "nomeEmpresa", cidadeempresa AS "cidadeEmpresa",
      telefoneempresa AS "telefoneEmpresa", emailempresa AS "emailEmpresa", cnpjempresa AS "cnpjEmpresa",
      descricaoempresa AS "descricaoEmpresa", chavepix AS "chavePix",
      dadosbancarios AS "dadosBancarios"
  `;
  return registros[0];
}
