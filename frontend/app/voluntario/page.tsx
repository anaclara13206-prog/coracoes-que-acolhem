"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { FiExternalLink, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import api from "@/services/api";
import "./Voluntario.css";
interface Empresa {
  idAdministrador: number;
  nomeEmpresa: string | null;
  cidadeEmpresa: string | null;
  descricaoEmpresa: string | null;
}
export default function Voluntario() {
  const { usuario, carregando } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idade, setIdade] = useState("");
  const [cidade, setCidade] = useState("");
  const [dataDisponibilidade, setDataDisponibilidade] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("09:00");
  const [horarioFim, setHorarioFim] = useState("12:00");
  const [areaInteresse, setAreaInteresse] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(true);
  useEffect(() => {
    api.get("/administradores/publicos").then(r => setEmpresas(r.data)).catch(() => toast.error("Não foi possível carregar as instituições parceiras.")).finally(() => setCarregandoEmpresas(false));
  }, []);
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTelefone(usuario.telefone || "");
      api.get("/usuarios/perfil").then(r => setTelefone(r.data.telefoneUsuario || "")).catch(() => { });
    }
  }, [usuario]);
  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!usuario) {
      toast.info("Para enviar sua solicitação, faça seu cadastro ou entre na sua conta.");
      return;
    }
    if (!empresa) {
      toast.info("Escolha a instituição em que deseja se voluntariar.");
      return;
    }
    if (!dataDisponibilidade || !horarioInicio || !horarioFim) {
      toast.info("Escolha o dia e o horário em que você está disponível.");
      return;
    }
    if (horarioFim <= horarioInicio) {
      toast.info("O horário final precisa ser depois do horário inicial.");
      return;
    }
    const disponibilidade = `${dataDisponibilidade} | ${horarioInicio} às ${horarioFim}`;
    setEnviando(true);
    try {
      const questionario = await api.post("/questionarios", {
        idAdministrador: Number(empresa),
        respostas: { idade, cidade, disponibilidade, dataDisponibilidade, horarioInicio, horarioFim, areaInteresse },
      });
      const idQuestionario = questionario.data?.questionario?.[0]?.idQuestionario ?? questionario.data?.questionario?.idQuestionario;
      await api.post("/voluntarios", {
        idAdministrador: Number(empresa), idade: Number(idade), cidade, disponibilidade, areaInteresse, idQuestionario
      });
      toast.success("Solicitação e questionário enviados para a instituição!");
      setEmpresa("");
      setIdade("");
      setCidade("");
      setDataDisponibilidade("");
      setHorarioInicio("09:00");
      setHorarioFim("12:00");
      setAreaInteresse("");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível enviar sua solicitação.");
    }
    finally {
      setEnviando(false);
    }
  }
  const camposSomenteLeitura = carregando || !!usuario;
  return <>
    <Header />
    <main className="voluntario-container">
      <div className="voluntario-card">
        <div className="voluntario-topo">
          <div>
            <p className="form-kicker">Doação de tempo e cuidado</p>
            <h1>Seja um voluntário</h1>
          </div>
        </div>
        <p className="voluntario-subtitulo">Preencha seus dados, escolha uma instituição e informe
          como deseja participar. Sua solicitação ficará vinculada à instituição selecionada.</p>
        {!usuario && !carregando && <div className="voluntario-aviso">
          <FiInfo />
          <div>
            <strong>Antes de enviar</strong>
            <p>Você pode conhecer o formulário, mas para registrar a solicitação é necessário ter uma conta.
              <Link href="/login">Entre</Link> ou <Link href="/cadastro">crie seu cadastro</Link>.</p>
          </div>
        </div>}

        <form className="voluntario-form" onSubmit={enviar}>
          <div className="form-section">
            <h2>Seus dados</h2>
            <div className="form-grid">
              <Input label="Nome completo" value={nome} onChange={e => setNome(e.target.value)} disabled={camposSomenteLeitura} required />
              <Input label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={camposSomenteLeitura} required />
              <Input label="Telefone" inputMode="numeric" value={telefone} onChange={e => setTelefone(e.target.value.replace(/\D/g, ""))} placeholder="Somente números" maxLength={15} disabled={carregando} required />
              <Input label="Idade" type="number" min={1} max={120} value={idade} onChange={e => setIdade(e.target.value)} required />
              <Input label="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} required />
            </div>
          </div>

          <div className="form-section">
            <h2>Onde e como você deseja participar?</h2>
            <label className="select-group">
              <span>Instituição parceira
              </span>
              <select value={empresa} onChange={e => setEmpresa(e.target.value)} disabled={carregandoEmpresas} required>
                <option value="">{carregandoEmpresas ? "Carregando instituições..." : "Selecione onde deseja se voluntariar"}</option>
                {empresas.map(item => <option key={item.idAdministrador} value={item.idAdministrador}>
                  {item.nomeEmpresa || `Instituição ${item.idAdministrador}`}{item.cidadeEmpresa ? ` — ${item.cidadeEmpresa}` : ""}</option>)}</select>
            </label>
            <div className="disponibilidade-calendario">
              <label className="select-group" htmlFor="data-disponibilidade">
                <span>Dia disponível</span>
                <input id="data-disponibilidade" type="date" value={dataDisponibilidade}
                  min={(() => { const hoje = new Date(); const ano = hoje.getFullYear(); const mes = String(hoje.getMonth() + 1).padStart(2, "0"); const dia = String(hoje.getDate()).padStart(2, "0"); return `${ano}-${mes}-${dia}`; })()} onChange={e => setDataDisponibilidade(e.target.value)} required />
              </label>
              <div className="form-grid">
                <label className="select-group" htmlFor="horario-inicio">
                  <span>Horário inicial</span>
                  <input id="horario-inicio" type="time" value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} required />
                </label>
                <label className="select-group" htmlFor="horario-fim">
                  <span>Horário final</span>
                  <input id="horario-fim" type="time" value={horarioFim} onChange={e => setHorarioFim(e.target.value)} required />
                </label>
              </div>
              <p className="disponibilidade-ajuda">Selecione no calendário o dia e informe o período em que poderá participar.</p>
            </div>
            <Input label="Área de interesse" value={areaInteresse} onChange={e => setAreaInteresse(e.target.value)} placeholder="Ex.: Recreação, Educação, Eventos..." required />
          </div>

          <div className="voluntario-final">
            <FiInfo />
            <p>Uma mesma pessoa pode participar de instituições diferentes.
              A instituição analisará sua solicitação e poderá entrar em contato para orientar os próximos passos.</p>
          </div>

          <Button texto={enviando ? "Enviando..." : "Enviar solicitação"} type="submit" />
        </form>

        <section className="instituicoes-referencia">
          <p className="form-kicker">Para conhecer outras iniciativas</p>
          <h2>Instituições e sites de referência</h2>
          <p className="instituicoes-referencia-intro">Algumas referências utilizadas no projeto.</p>
          <div className="instituicoes-referencia-grid">
            <a className="instituicao-referencia" href="https://www.atados.com.br/" target="_blank" rel="noreferrer">
              <div>
                <strong>Atados</strong>
                <span>Conexão entre pessoas e organizações.</span>
              </div>
              <FiExternalLink />
            </a>
            <a className="instituicao-referencia" href="https://www.cnj.jus.br/adote-um-boa-noite-programa-do-tjsp-promoveu-mais-de-70-adocoes-de-adolescentes" target="_blank" rel="noreferrer">
              <div>
                <strong>Adote um Boa Noite</strong>
                <span>Referência do projeto sobre acolhimento e adoção.</span>
              </div>
              <FiExternalLink />
            </a>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>;
}
