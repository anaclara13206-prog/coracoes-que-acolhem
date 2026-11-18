"use client";
import { useEffect, useState } from "react";
import { FiBookOpen, FiHeart, FiMail, FiUserCheck, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface DadosDashboard {
  usuarios: number;
  voluntarios: number;
  doacoes: number;
  contatos: number;
  questionarios: number;
}
interface Instituicao {
  nomeEmpresa?: string | null;
  cnpjEmpresa?: string | null;
  cidadeEmpresa?: string | null;
  telefoneEmpresa?: string | null;
  emailEmpresa?: string | null;
  descricaoEmpresa?: string | null;
}
export default function Dashboard() {
  const [dados, setDados] = useState<DadosDashboard>({
    usuarios: 0,
    voluntarios: 0,
    doacoes: 0,
    contatos: 0,
    questionarios: 0,
  });
  const [instituicao, setInstituicao] = useState<Instituicao | null>(null);
  useEffect(() => {
    Promise.all([
      api.get("/usuarios"),
      api.get("/voluntarios"),
      api.get("/doacoes"),
      api.get("/contatos"),
      api.get("/questionarios"),
    ])
      .then(([usuarios, voluntarios, doacoes, contatos, questionarios]) => {
        setDados({
          usuarios: usuarios.data.length,
          voluntarios: voluntarios.data.length,
          doacoes: doacoes.data.length,
          contatos: contatos.data.length,
          questionarios: questionarios.data.length,
        });
      })
      .catch(() => toast.info("Alguns indicadores ainda não puderam ser carregados."));
    api.get("/administradores/minha")
      .then(({ data }) => setInstituicao(data))
      .catch(() => toast.info("Não foi possível carregar os dados da instituição."));
  }, []);
  const cards = [
    { Icon: FiUsers, numero: dados.usuarios, titulo: "Usuários cadastrados" },
    { Icon: FiUserCheck, numero: dados.voluntarios, titulo: "Voluntários da instituição" },
    { Icon: FiBookOpen, numero: dados.questionarios, titulo: "Questionários recebidos" },
    { Icon: FiHeart, numero: dados.doacoes, titulo: "Doações registradas" },
    { Icon: FiMail, numero: dados.contatos, titulo: "Mensagens recebidas" },
  ];
  return (<>
    <h1 className="admin-titulo">Dashboard</h1>
    <p className="admin-subtitulo">
      Painel exclusivo da instituição. Os dados de voluntários, questionários, contatos e doações
      são filtrados para a empresa desta conta.
    </p>

    <section className="cards-dashboard">
      {cards.map(({ Icon, numero, titulo }, index) => (<div className="card-dashboard" key={titulo}>
        <Icon style={{
          color: index % 2 === 0 ? "var(--azul-escuro)" : "var(--rosa-escuro)",
          fontSize: 22,
        }} />
        <h2>{numero}</h2>
        <p>{titulo}</p>
      </div>))}
    </section>

    <section className="admin-config-card dashboard-instituicao">
      <h2>Minhas informações</h2>
      {instituicao ? (<dl className="dashboard-dados-instituicao">
        <div>
          <dt>Nome da instituição</dt>
          <dd>{instituicao.nomeEmpresa || "Não informado"}</dd>
        </div>
        <div>
          <dt>CNPJ</dt>
          <dd>{instituicao.cnpjEmpresa || "Não informado"}</dd>
        </div>
        <div>
          <dt>Cidade</dt>
          <dd>{instituicao.cidadeEmpresa || "Não informada"}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{instituicao.telefoneEmpresa || "Não informado"}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{instituicao.emailEmpresa || "Não informado"}</dd>
        </div>
        <div>
          <dt>Sobre a instituição</dt>
          <dd>{instituicao.descricaoEmpresa || "Nenhuma descrição cadastrada."}</dd>
        </div>
      </dl>) : (<p>Carregando os dados da instituição...</p>)}
      <Link className="admin-botao" href="/administrador/configuracoes">Editar informações da instituição</Link>
    </section>

    <section className="ultimas-atividades">
      <h2>Atalhos do painel</h2>
      <div className="admin-acoes">
        <Link className="admin-botao" href="/administrador/voluntarios">Voluntários e frequência</Link>
        <Link className="editar" href="/administrador/questionarios">Questionários</Link>
        <Link className="editar" href="/administrador/doacoes">Doações</Link>
        <Link className="editar" href="/administrador/contatos">Mensagens</Link>
        <Link className="editar" href="/administrador/informacoes">Informações</Link>
      </div>
    </section>
  </>);
}
