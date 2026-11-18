"use client";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface I {
  idInformacao: number;
  tituloInformacao: string;
  conteudoInformacao: string;
  fonteInformacao?: string | null;
  categoria?: string | null;
  imagemUrl?: string | null;
}
export default function InformacoesAdmin() {
  const [lista, setLista] = useState<I[]>([]);
  const [editando, setEditando] = useState<I | null>(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [fonte, setFonte] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [salvando, setSalvando] = useState(false);
  async function carregar() {
    try {
      const { data } = await api.get("/informacoes/admin/minhas");
      setLista(data || []);
    }
    catch (e: any) {
      toast.error(e?.response?.data?.mensagem || "Não foi possível carregar as informações.");
    }
  }
  useEffect(() => { carregar(); }, []);
  function preparar(i?: I) { setEditando(i || null); setTitulo(i?.tituloInformacao || ""); setConteudo(i?.conteudoInformacao || ""); setFonte(i?.fonteInformacao || ""); setCategoria(i?.categoria || ""); setImagemUrl(i?.imagemUrl || ""); }
  async function salvar(e: FormEvent) {
    e.preventDefault(); setSalvando(true); try {
      if (editando)
        await api.put(`/informacoes/${editando.idInformacao}`, { titulo, conteudo, fonte, categoria, imagemUrl });
      else
        await api.post("/informacoes", { titulo, conteudo, fonte, categoria, imagemUrl });
      toast.success("Informação salva.");
      preparar();
      await carregar();
    }
      catch (error: any) {
        toast.error(error?.response?.data?.mensagem || "Não foi possível salvar.");
      }
      finally {
        setSalvando(false);
      }
  }
  async function remover(id: number) {
    if (!confirm("Remover esta informação?"))
      return; try {
        await api.delete(`/informacoes/${id}`);
        toast.success("Informação removida.");
        await carregar();
      }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível remover.");
    }
  }
  return <>
    <h1 className="admin-titulo">Informações</h1>
    <p className="admin-subtitulo">Crie, altere e remova conteúdos exibidos na área informativa da sua instituição.</p>
    <section className="admin-config-card">
      <form onSubmit={salvar}>
        <div className="admin-config-grid">
          <label>Título<input value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </label>
          <label>Categoria<input value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Adoção, acolhimento, voluntariado..." />
          </label>
          <label>Fonte<input value={fonte} onChange={e => setFonte(e.target.value)} placeholder="Nome ou site da fonte" />
          </label>
          <label>Imagem<input value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} placeholder="/imagem.jpg ou URL" />
          </label>
        </div>
        <label className="admin-config-textarea">Conteúdo<textarea value={conteudo} onChange={e => setConteudo(e.target.value)} required />
        </label>
        <div className="admin-acoes">
          <button className="admin-botao" type="submit">{salvando ? "Salvando..." : editando ? "Salvar alterações" : "Adicionar informação"}</button>{editando && <button type="button" className="editar" onClick={() => preparar()}>Cancelar edição</button>}</div>
      </form>
    </section>
    <section className="tabela-admin informacoes-admin-lista">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Fonte</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{lista.length === 0 ? <tr>
          <td colSpan={4}>Nenhuma informação cadastrada pela instituição.</td>
        </tr> : lista.map(i => <tr key={i.idInformacao}>
          <td>{i.tituloInformacao}</td>
          <td>{i.categoria || "—"}</td>
          <td>{i.fonteInformacao || "—"}</td>
          <td>
            <button className="visualizar" onClick={() => preparar(i)}>Editar</button>
            <button className="excluir" onClick={() => remover(i.idInformacao)}>Excluir</button>
          </td>
        </tr>)}</tbody>
      </table>
    </section>
  </>;
}
