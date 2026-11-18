"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCalendar, FiCheckCircle, FiClock, FiHeart, FiLogOut, FiMail, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import "./Perfil.css";
interface Doacao {
  motivoRecusa?: string | null;
  idDoacao: number;
  statusDoacao?: string;
  tipoDoacao: string;
  valorDoacao: string | number | null;
  dataDoacao: string | null;
  tipoPagamentoDoacao: string | null;
  descricaoDoacao: string | null;
  nomeEmpresa?: string | null;
}
interface Voluntario {
  idVoluntario: number;
  idAdministrador: number | null;
  nomeEmpresa?: string | null;
  statusVoluntario: string;
  dataInscricao: string;
  dataInicio: string | null;
  dataFim: string | null;
  disponibilidade: string | null;
  cidade: string | null;
  areaInteresse: string | null;
  horarioInicio: string | null;
  horarioFim: string | null;
}
interface Presenca {
  idPresenca: number;
  idVoluntario: number;
  dataPresenca: string;
  horaInicio: string | null;
  horaFim: string | null;
  status: string;
  observacao: string | null;
}
interface Questionario {
  idQuestionario: number;
  statusQuestionario: string;
  dataEnvioQuestionario: string;
  nomeEmpresa?: string | null;
}
interface Contato {
  idContato: number;
  assuntoContato: string;
  mensagemContato: string;
  dataContato: string;
  respostaContato?: string | null;
  dataResposta?: string | null;
}
export default function Perfil() {
  const router = useRouter();
  const { usuario, carregando, logout, atualizarUsuario } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [voluntariados, setVoluntariados] = useState<Voluntario[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  useEffect(() => {
    if (!carregando && !usuario)
      router.replace("/login");
  }, [carregando, usuario, router]);
  useEffect(() => {
    if (!usuario)
      return;
    setNome(usuario.nome);
    setEmail(usuario.email);
    setTelefone(usuario.telefone || "");
    api.get("/usuarios/perfil").then(r => {
      setNome(r.data.nomeUsuario);
      setEmail(r.data.emailUsuario);
      setTelefone(r.data.telefoneUsuario || "");
      setEndereco(r.data.enderecoUsuario || "");
    }).catch(() => { });
    Promise.all([api.get("/doacoes/minhas"), api.get("/voluntarios/minha"), api.get("/questionarios/minhas"), api.get("/contatos/minhas")])
      .then(([d, v, q, c]) => {
        setDoacoes(d.data || []);
        setVoluntariados(v.data || []);
        setQuestionarios(q.data || []);
        setContatos(c.data || []);
        return Promise.all((v.data || []).map((item: Voluntario) => api.get(`/voluntarios/${item.idVoluntario}/presencas`).then(r => r.data || []).catch(() => [])));
      })
      .then((listas) => setPresencas((listas || []).flat()))
      .catch(() => toast.info("Não foi possível carregar todo o histórico agora."))
      .finally(() => setCarregandoHistorico(false));
  }, [usuario]);
  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    try {
      const { data } = await api.put("/usuarios/perfil", { nome, email, telefone: telefone.replace(/\D/g, ""), endereco });
      atualizarUsuario({
        id: data.usuario.idUsuario, nome: data.usuario.nomeUsuario, email: data.usuario.emailUsuario,
        tipo: data.usuario.tipoUsuario || "usuario", telefone: data.usuario.telefoneUsuario || ""
      });
      toast.success("Perfil atualizado com sucesso.");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível salvar o perfil.");
    }
    finally {
      setSalvando(false);
    }
  }
  async function excluirConta() {
    const confirmou = window.confirm("Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita e removerá seus históricos pessoais.");
    if (!confirmou)
      return;
    try {
      await api.delete("/usuarios/perfil");
      logout();
      toast.success("Conta excluída.");
      router.replace("/");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível excluir a conta.");
    }
  }
  const presentes = useMemo(() => presencas.filter(p => p.status === "presente").length, [presencas]);
  const faltas = useMemo(() => presencas.filter(p => p.status === "falta").length, [presencas]);
  if (carregando || !usuario)
    return <>
      <Header />
      <main className="perfil-container">
        <div className="perfil-loading">Carregando seu perfil...</div>
      </main>
      <Footer />
    </>;
  return <>
    <Header />
    <main className="perfil-container">
      <div className="perfil-shell">
        <section className="perfil-card perfil-principal">
          <div className="perfil-header">
            <div className="perfil-foto">
              <FiUser />
            </div>
            <div>
              <p className="perfil-kicker">
                Área do participante</p>
              <h1>Minha área</h1>
              <p>Seus dados, doações, voluntariados e histórico ficam reunidos em um só lugar.</p>
            </div>
          </div>
          <form className="perfil-form" onSubmit={salvar}>
            <div className="perfil-grid">
              <Input label="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required />
              <Input label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <Input label="Telefone" inputMode="numeric" value={telefone} onChange={e => setTelefone(e.target.value.replace(/\D/g, ""))} placeholder="Somente números" />
              <Input label="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Cidade, bairro ou endereço" />
            </div>
            <div className="perfil-acoes-form">
              <Button texto={salvando ? "Salvando..." : "Salvar alterações"} type="submit" />{usuario.tipo !== "administrador" && <button type="button" className="perfil-excluir-conta" onClick={excluirConta}>Excluir minha conta</button>}</div>
          </form>

          {usuario.tipo !== "administrador" && <>
            <section className="historico-section">
              <div className="historico-titulo">
                <div>
                  <p className="perfil-kicker">Participação</p>
                  <h2>Resumo da minha atividade</h2>
                </div>
              </div>
              <div className="historico-resumo">
                <div>
                  <FiHeart />
                  <strong>{doacoes.length}</strong>
                  <span>doações</span>
                </div>
                <div>
                  <FiCalendar />
                  <strong>{voluntariados.length}</strong>
                  <span>voluntariados</span>
                </div>
                <div>
                  <FiCheckCircle />
                  <strong>{presentes}</strong>
                  <span>presenças</span>
                </div>
                <div>
                  <FiClock />
                  <strong>{faltas}</strong>
                  <span>faltas</span>
                </div>
              </div>

            </section>

            <section className="historico-section">
              <h2>Minhas doações</h2>{carregandoHistorico ? <p className="historico-vazio">Carregando...</p> : doacoes.length === 0 ? <p className="historico-vazio">Você ainda não possui doações registradas.</p> : <div className="historico-lista">{doacoes.map(d => <article className="historico-item" key={d.idDoacao}>
                <div>
                  <strong>{d.tipoDoacao}</strong>
                  <p>{d.descricaoDoacao || "Doação registrada na plataforma."}</p>{d.motivoRecusa && <small>Motivo da
                    recusa: {d.motivoRecusa}</small>}</div>
                <div className="historico-meta">
                  <span>{d.dataDoacao ? new Date(d.dataDoacao).toLocaleDateString("pt-BR") : "—"}</span>
                  <span>{d.valorDoacao ? `R$ ${Number(d.valorDoacao).toFixed(2).replace(".", ",")}` : "Sem valor informado"}</span>
                  <span>Status: {d.statusDoacao || "Pendente de confirmação"}</span>
                  <small>{d.nomeEmpresa || "Instituição não informada"}</small>
                </div>
              </article>)}</div>}</section>

            <section className="historico-section">
              <h2>Meus voluntariados</h2>{carregandoHistorico ? <p className="historico-vazio">
                Carregando...</p> : voluntariados.length === 0 ? <p className="historico-vazio">Você ainda não possui inscrições de voluntariado.

                </p> : <div className="historico-lista">{voluntariados.map(v => <article className="historico-item" key={v.idVoluntario}>
                  <div>
                    <strong>{v.statusVoluntario}</strong>
                    <p>{v.areaInteresse || "Voluntariado"}
                      {v.cidade ? `• ${v.cidade}` : ""} {v.nomeEmpresa ? `• ${v.nomeEmpresa}` : ""}</p>
                    <small>Inscrição:
                      {new Date(v.dataInscricao).toLocaleDateString("pt-BR")}</small>
                  </div>
                  <div className="historico-meta">
                    <span>{v.dataInicio ? `Início: ${new Date(v.dataInicio).toLocaleDateString("pt-BR")}` : "Aguardando aprovação"}</span>
                    <span>{v.dataFim ? `Fim: ${new Date(v.dataFim).toLocaleDateString("pt-BR")}` : "Em andamento ou pendente"}</span>
                    <small>{v.disponibilidade || "Horário a combinar"}</small>
                  </div>
                </article>)}</div>}</section>

            <section className="historico-section">
              <h2>Frequência dos voluntariados</h2>{presencas.length === 0 ? <p className="historico-vazio">Ainda não há registros de presença ou falta.</p> : <div className="historico-lista">{presencas.map(p => <article className="historico-item" key={p.idPresenca}>
                <div>
                  <strong>{p.status}</strong>
                  <p>{p.observacao || "Registro de frequência"}</p>
                </div>
                <div className="historico-meta">
                  <span>{new Date(p.dataPresenca).toLocaleDateString("pt-BR")}</span>
                  <span>{p.horaInicio || "--"} às {p.horaFim || "--"}</span>
                </div>
              </article>)}</div>}</section>

            <section className="historico-section">
              <h2>Mensagens enviadas</h2>{contatos.length === 0 ? <p className="historico-vazio">Você ainda não enviou mensagens pelo contato.</p> : <div className="historico-lista">{contatos.map(c => <article className="historico-item" key={c.idContato}>
                <div>
                  <strong>
                    {c.assuntoContato}</strong>
                  <p>{c.mensagemContato}</p>{c.respostaContato && <p className="historico-resposta">
                    <strong>Resposta da instituição:</strong> {c.respostaContato}</p>}</div>
                <div className="historico-meta">
                  <span>{new Date(c.dataContato).toLocaleDateString("pt-BR")}</span>{c.dataResposta && <small>Respondida em
                    {new Date(c.dataResposta).toLocaleDateString("pt-BR")}</small>}</div>
              </article>)}</div>}</section>

            <section className="historico-section">
              <h2>Questionários enviados</h2>{questionarios.length === 0 ? <p className="historico-vazio">Nenhum questionário enviado.</p> : <div className="historico-lista">
                {questionarios.map(q => <article className="historico-item" key={q.idQuestionario}>
                  <div>
                    <strong>Questionário #{q.idQuestionario}</strong>
                    <p>{q.nomeEmpresa || "Instituição parceira"}</p>
                  </div>
                  <div className="historico-meta">
                    <span>{new Date(q.dataEnvioQuestionario).toLocaleDateString("pt-BR")}</span>
                    <span>{q.statusQuestionario}</span>
                  </div>
                </article>)}</div>}</section>
          </>}

        </section>

        <aside className="perfil-side">
          <div className="perfil-resumo">
            <div className="perfil-resumo-icon">
              <FiHeart />
            </div>
            <span>Seu acesso</span>
            <strong>{usuario.tipo === "administrador" ? "Administrador" : "Participante"}</strong>
            <p>{usuario.tipo === "administrador" ? "Você também pode acessar o painel da sua instituição." : "Aqui você acompanha seus dados e toda a sua participação no projeto."}</p>{usuario.tipo === "administrador" && <Button texto="Área administrativa" href="/administrador" variante="azul" />}</div>
          <div className="perfil-contato">
            <FiMail />
            <div>
              <strong>Precisa de ajuda?</strong>
              <p>Envie uma mensagem para uma instituição pela aba Contato.</p>
            </div>
          </div>
          <div className="perfil-sair">
            <FiLogOut />
            <div>
              <strong>Encerrar sessão</strong>
              <p>Sair desta conta neste dispositivo.</p>
            </div>
            <button type="button" onClick={() => { logout(); router.replace("/"); }}>Sair</button>
          </div>
        </aside>
      </div>
    </main>
    <Footer />
  </>;
}
