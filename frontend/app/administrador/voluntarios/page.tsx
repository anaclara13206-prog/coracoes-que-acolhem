"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface V {
  idVoluntario: number;
  idade: number | null;
  cidade: string | null;
  disponibilidade: string | null;
  areaInteresse: string | null;
  statusVoluntario: string;
  idUsuario: number | null;
  dataInscricao: string;
  dataInicio: string | null;
  dataFim: string | null;
  horarioInicio: string | null;
  horarioFim: string | null;
  idAdministrador: number | null;
}
interface U {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  telefoneUsuario: string | null;
}
interface P {
  idPresenca: number;
  dataPresenca: string;
  horaInicio: string | null;
  horaFim: string | null;
  status: string;
  observacao: string | null;
}
export default function VoluntariosAdmin() {
  const [lista, setLista] = useState<V[]>([]);
  const [usuarios, setUsuarios] = useState<U[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [presencas, setPresencas] = useState<P[]>([]);
  const [data, setData] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [statusFreq, setStatusFreq] = useState("presente");
  const [obs, setObs] = useState("");
  async function carregar() {
    try {
      const [v, u] = await Promise.all([api.get("/voluntarios"), api.get("/usuarios")]);
      setLista(v.data);
      setUsuarios(u.data);
    }
    catch (e: any) {
      toast.error(e?.response?.data?.mensagem || "Não foi possível carregar os voluntários.");
    }
  }
  useEffect(() => { carregar(); }, []);
  const filtrados = useMemo(() => lista.filter(v => { const u = usuarios.find(x => x.idUsuario === v.idUsuario); return `${u?.nomeUsuario || ""} ${u?.emailUsuario || ""} ${v.cidade || ""} ${v.areaInteresse || ""}`.toLowerCase().includes(busca.toLowerCase()); }), [lista, usuarios, busca]);
  async function status(id: number, status: string) {
    try {
      const { data } = await api.patch(`/voluntarios/${id}/status`, { status });
      setLista(x => x.map(v => v.idVoluntario === id ? data.voluntario : v));
      toast.success("Status atualizado.");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível atualizar.");
    }
  }
  async function finalizar(id: number) {
    try {
      const { data } = await api.patch(`/voluntarios/${id}/finalizar`);
      setLista(x => x.map(v => v.idVoluntario === id ? data.voluntario : v));
      toast.success(data.mensagem);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível finalizar.");
    }
  }
  async function abrir(id: number) {
    setSelecionado(id); try {
      const { data } = await api.get(`/voluntarios/${id}/presencas`);
      setPresencas(data || []);
    }
      catch {
        setPresencas([]);
      }
  }
  async function registrar() {
    if (!selecionado || !data) {
      toast.info("Informe a data.");
      return;
    } try {
      await api.post(`/voluntarios/${selecionado}/presencas`, { data, horaInicio: inicio, horaFim: fim, status: statusFreq, observacao: obs });
      toast.success("Frequência registrada.");
      setData("");
      setInicio("");
      setFim("");
      setObs("");
      abrir(selecionado);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível registrar.");
    }
  }
  return <>
    <h1 className="admin-titulo">Voluntários</h1>
    <p className="admin-subtitulo">Solicitações, períodos e frequência dos voluntários da sua instituição.</p>
    <div className="admin-acoes">
      <input className="admin-pesquisa" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar por nome, e-mail ou cidade..." />
    </div>
    <section className="tabela-admin">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Cidade</th>
            <th>Área</th>
            <th>Período</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{filtrados.length === 0 ? <tr>
          <td colSpan={7}>Nenhuma solicitação encontrada.</td>
        </tr> : filtrados.map(v => {
          const u = usuarios.find(x => x.idUsuario === v.idUsuario); return <tr key={v.idVoluntario}>
            <td>{u?.nomeUsuario || "—"}</td>
            <td>{u?.emailUsuario || "—"}</td>
            <td>{v.cidade || "—"}</td>
            <td>{v.areaInteresse || "—"}</td>
            <td>{v.dataInicio ? new Date(v.dataInicio).toLocaleDateString("pt-BR") : "—"}{v.dataFim ? ` → ${new Date(v.dataFim).toLocaleDateString("pt-BR")}` : ""}</td>
            <td>
              <span className={`status ${v.statusVoluntario === "aprovado" ? "ativo" : "inativo"}`}>{v.statusVoluntario}</span>
            </td>
            <td>
              <button className="visualizar" onClick={() => abrir(v.idVoluntario)}>Frequência</button>{v.statusVoluntario === "pendente" && <button className="visualizar" onClick={() => status(v.idVoluntario, "aprovado")}>Aprovar</button>}{v.statusVoluntario === "aprovado" && <button className="editar" onClick={() => finalizar(v.idVoluntario)}>Finalizar</button>}</td>
          </tr>;
        })}</tbody>
      </table>
    </section>
    {selecionado && <section className="admin-config-card" style={{ marginTop: 20 }}>
      <div className="admin-acoes">
        <h2 style={{ margin: 0, flex: 1 }}>Frequência do voluntário #{selecionado}</h2>
        <button className="excluir" onClick={() => setSelecionado(null)}>Fechar</button>
      </div>
      <div className="admin-config-grid">
        <label>Data<input type="date" value={data} onChange={e => setData(e.target.value)} />
        </label>
        <label>Entrada<input type="time" value={inicio} onChange={e => setInicio(e.target.value)} />
        </label>
        <label>Saída<input type="time" value={fim} onChange={e => setFim(e.target.value)} />
        </label>
        <label>Status<select value={statusFreq} onChange={e => setStatusFreq(e.target.value)}>
          <option value="presente">Presente</option>
          <option value="falta">Falta</option>
          <option value="justificada">Falta justificada</option>
        </select>
        </label>
      </div>
      <label className="admin-config-textarea">Observação<textarea value={obs} onChange={e => setObs(e.target.value)} />
      </label>
      <button className="admin-botao" onClick={registrar}>Registrar frequência</button>
      <div style={{ marginTop: 20 }}>{presencas.length === 0 ? <p>Nenhum registro ainda.</p> : <div className="tabela-admin">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>{presencas.map(p => <tr key={p.idPresenca}>
            <td>{new Date(p.dataPresenca).toLocaleDateString("pt-BR")}</td>
            <td>{p.horaInicio || "--"} às {p.horaFim || "--"}</td>
            <td>{p.status}</td>
            <td>{p.observacao || "—"}</td>
          </tr>)}</tbody>
        </table>
      </div>}</div>
    </section>}
  </>;
}
