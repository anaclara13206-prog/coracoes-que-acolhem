"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface D {
  comprovanteUrl?: string | null;
  motivoRecusa?: string | null;
  idDoacao: number;
  tipoDoacao: string;
  valorDoacao: string | number | null;
  dataDoacao: string | null;
  tipoPagamentoDoacao: string | null;
  descricaoDoacao: string | null;
  statusDoacao?: string;
  idUsuario: number | null;
  nomeUsuario?: string | null;
  emailUsuario?: string | null;
}
export default function DoacoesAdmin() {
  const [lista, setLista] = useState<D[]>([]);
  const [tipo, setTipo] = useState("Todos");
  const [confirmando, setConfirmando] = useState<number | null>(null);
  async function carregar() {
    try {
      const { data } = await api.get("/doacoes");
      setLista(data || []);
    }
    catch (e: any) {
      toast.error(e?.response?.data?.mensagem || "Não foi possível carregar as doações.");
    }
  }
  useEffect(() => { carregar(); }, []);
  const filtradas = useMemo(() => tipo === "Todos" ? lista : lista.filter(d => d.tipoDoacao === tipo), [lista, tipo]);
  async function recusar(id: number) {
    const motivo = window.prompt("Informe o motivo da recusa da doação:"); if (!motivo?.trim())
      return; try {
        await api.patch(`/doacoes/${id}/recusar`, { motivo: motivo.trim() });
        toast.success("Doação recusada e motivo registrado.");
        await carregar();
      }
    catch (e: any) {
      toast.error(e?.response?.data?.mensagem || "Não foi possível recusar.");
    }
  }
  async function confirmar(id: number) {
    setConfirmando(id); try {
      await api.patch(`/doacoes/${id}/confirmar`);
      toast.success("Recebimento confirmado.");
      await carregar();
    }
      catch (e: any) {
        toast.error(e?.response?.data?.mensagem || "Não foi possível confirmar.");
      }
      finally {
        setConfirmando(null);
      }
  }
  return <>
    <h1 className="admin-titulo">Doações</h1>
    <p className="admin-subtitulo">Confira as solicitações destinadas à sua instituição. Marque como confirmada somente depois de verificar o recebimento.</p>
    <div className="admin-acoes">
      <select className="admin-pesquisa" value={tipo} onChange={e => setTipo(e.target.value)}>
        <option>Todos</option>
        <option>Dinheiro</option>
        <option>Brinquedos</option>
        <option>Roupas</option>
        <option>Alimentos</option>
        <option>Tempo</option>
      </select>
    </div>
    <section className="tabela-admin">
      <table>
        <thead>
          <tr>
            <th>Doador</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Pagamento</th>
            <th>Data</th>
            <th>Status</th>
            <th>Descrição</th>
            <th>Comprovante</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>{filtradas.length === 0 ? <tr>
          <td colSpan={9}>Nenhuma doação encontrada.</td>
        </tr> : filtradas.map(d => <tr key={d.idDoacao}>
          <td>{d.nomeUsuario || "—"}<small style={{ display: "block" }}>{d.emailUsuario || ""}</small>
          </td>
          <td>{d.tipoDoacao}</td>
          <td>{d.valorDoacao ? `R$ ${Number(d.valorDoacao).toFixed(2).replace(".", ",")}` : "—"}</td>
          <td>{d.tipoPagamentoDoacao || "—"}</td>
          <td>{d.dataDoacao ? new Date(d.dataDoacao).toLocaleDateString("pt-BR") : "—"}</td>
          <td>{d.statusDoacao || "Pendente de confirmação"}</td>
          <td>{d.descricaoDoacao || d.motivoRecusa || "—"}</td>
          <td>{d.comprovanteUrl ? <a href={d.comprovanteUrl} target="_blank" rel="noreferrer">Visualizar</a> : "—"}</td>
          <td>{d.statusDoacao === "Confirmada" ? <span>Confirmada</span> : d.statusDoacao === "Recusada" ? <span>Recusada</span> : <button className="visualizar" disabled={confirmando === d.idDoacao} onClick={() => confirmar(d.idDoacao)}>{confirmando === d.idDoacao ? "Confirmando..." : "Confirmar recebimento"}</button>}{d.statusDoacao !== "Recusada" && <button className="excluir" onClick={() => recusar(d.idDoacao)}>Recusar</button>}</td>
        </tr>)}</tbody>
      </table>
    </section>
  </>;
}
