"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface Contato {
  idContato: number;
  nomeContato: string;
  emailContato: string;
  assuntoContato: string;
  mensagemContato: string;
  dataContato: string;
  respostaContato?: string | null;
  dataResposta?: string | null;
}
export default function ContatosAdmin() {
  const [lista, setLista] = useState<Contato[]>([]);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [enviando, setEnviando] = useState<number | null>(null);
  async function carregar() {
    try {
      const { data } = await api.get("/contatos");
      setLista(data || []);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível carregar as mensagens.");
    }
  }
  useEffect(() => {
    void carregar();
  }, []);
  async function responder(id: number) {
    const resposta = (respostas[id] || "").trim();
    if (!resposta) {
      toast.info("Escreva uma resposta antes de enviar.");
      return;
    }
    setEnviando(id);
    try {
      await api.patch(`/contatos/${id}/resposta`, { resposta });
      toast.success("Resposta registrada. Ela ficará disponível no registro da mensagem.");
      setRespostas((atual) => ({ ...atual, [id]: "" }));
      await carregar();
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível registrar a resposta.");
    }
    finally {
      setEnviando(null);
    }
  }
  async function remover(id: number) {
    if (!confirm("Excluir esta mensagem?"))
      return;
    try {
      await api.delete(`/contatos/${id}`);
      setLista((atual) => atual.filter((contato) => contato.idContato !== id));
      toast.success("Mensagem removida.");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível remover.");
    }
  }
  return (<>
    <h1 className="admin-titulo">Mensagens</h1>
    <p className="admin-subtitulo">Leia as mensagens destinadas à sua instituição, registre uma resposta e, se necessário, remova o contato.</p>
    <section className="tabela-admin">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Assunto</th>
            <th>Data</th>
            <th>Mensagem</th>
            <th>Resposta</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (<tr>
            <td colSpan={7}>Nenhuma mensagem encontrada.</td>
          </tr>) : lista.map((contato) => (<tr key={contato.idContato}>
            <td>{contato.nomeContato}</td>
            <td>{contato.emailContato}</td>
            <td>{contato.assuntoContato}</td>
            <td>{new Date(contato.dataContato).toLocaleDateString("pt-BR")}</td>
            <td>{contato.mensagemContato}</td>
            <td style={{ minWidth: 240 }}>
              {contato.respostaContato && <p>
                <strong>Resposta registrada:</strong> {contato.respostaContato}</p>}
              <textarea aria-label={`Resposta para ${contato.nomeContato}`} value={respostas[contato.idContato] ?? contato.respostaContato ?? ""} onChange={(event) => setRespostas((atual) => ({ ...atual, [contato.idContato]: event.target.value }))} rows={3} placeholder="Escreva uma resposta..." />
              <button className="visualizar" type="button" disabled={enviando === contato.idContato} onClick={() => responder(contato.idContato)}>{enviando === contato.idContato ? "Salvando..." : "Salvar resposta"}</button>
            </td>
            <td>
              <button className="excluir" type="button" onClick={() => remover(contato.idContato)}>Excluir</button>
            </td>
          </tr>))}
        </tbody>
      </table>
    </section>
  </>);
}
