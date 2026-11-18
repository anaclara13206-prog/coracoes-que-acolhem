"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface Q {
  idQuestionario: number;
  respostasQuestionario: string;
  dataEnvioQuestionario: string;
  statusQuestionario: string;
  nomeUsuario?: string;
  emailUsuario?: string;
  telefoneUsuario?: string;
  idVoluntario?: number | null;
}
export default function QuestionariosAdmin() {
  const [lista, setLista] = useState<Q[]>([]);
  const [aberto, setAberto] = useState<number | null>(null);
  useEffect(() => { api.get("/questionarios").then(r => setLista(r.data || [])).catch((e: any) => toast.error(e?.response?.data?.mensagem || "Não foi possível carregar os questionários.")); }, []);
  async function status(id: number, status: string) {
    try {
      await api.patch(`/questionarios/${id}/status`, { status });
      setLista(x => x.map(q => q.idQuestionario === id ? { ...q, statusQuestionario: status } : q));
      toast.success("Status atualizado.");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível atualizar.");
    }
  }
  return <>
    <h1 className="admin-titulo">Questionários</h1>
    <p className="admin-subtitulo">Respostas dos voluntários que escolheram a sua instituição.</p>
    <section className="tabela-admin">
      <table>
        <thead>
          <tr>
            <th>Voluntário</th>
            <th>E-mail</th>
            <th>Data</th>
            <th>Status</th>
            <th>Respostas</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>{lista.length === 0 ? <tr>
          <td colSpan={6}>Nenhum questionário encontrado.</td>
        </tr> : lista.map(q => <tr key={q.idQuestionario}>
          <td>{q.nomeUsuario || "—"}</td>
          <td>{q.emailUsuario || "—"}</td>
          <td>{new Date(q.dataEnvioQuestionario).toLocaleDateString("pt-BR")}</td>
          <td>
            <span className={`status ${q.statusQuestionario === "aprovado" ? "ativo" : "inativo"}`}>{q.statusQuestionario}</span>
          </td>
          <td>
            <button className="visualizar" onClick={() => setAberto(aberto === q.idQuestionario ? null : q.idQuestionario)}>{aberto === q.idQuestionario ? "Ocultar" : "Visualizar"}</button>
          </td>
          <td>
            <button className="visualizar" onClick={() => status(q.idQuestionario, "aprovado")}>Aprovar</button>
            <button className="excluir" onClick={() => status(q.idQuestionario, "recusado")}>Recusar</button>
          </td>
        </tr>)}{lista.map(q => aberto === q.idQuestionario ? <tr key={`r-${q.idQuestionario}`} className="linha-detalhe">
          <td colSpan={6}>
            <QuestionarioDetalhe texto={q.respostasQuestionario} />
          </td>
        </tr> : null)}</tbody>
      </table>
    </section>
  </>;
}
function QuestionarioDetalhe({ texto }: {
  texto: string;
}) {
  let obj: Record<string, string> | null = null; try {
    obj = JSON.parse(texto);
  }
    catch { } return <div className="questionario-detalhe">{obj ? Object.entries(obj).map(([k, v]) => <div key={k}>
      <strong>{k}</strong>
      <p>{v}</p>
    </div>) : <p>{texto}</p>}</div>;
}
