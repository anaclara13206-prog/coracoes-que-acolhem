"use client";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
import "./Configuracoes.css";
interface Instituicao {
  idAdministrador: number;
  cnpjEmpresa: string | null;
  nomeEmpresa: string | null;
  cidadeEmpresa: string | null;
  telefoneEmpresa: string | null;
  emailEmpresa: string | null;
  descricaoEmpresa: string | null;
  chavePix: string | null;
  dadosBancarios: string | null;
}
export default function ConfiguracoesAdmin() {
  const [empresa, setEmpresa] = useState<Instituicao | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [dadosBancarios, setDadosBancarios] = useState("");
  useEffect(() => {
    api.get("/administradores/minha")
      .then(({ data }) => {
        setEmpresa(data);
        setNome(data.nomeEmpresa || "");
        setCnpj(data.cnpjEmpresa || "");
        setCidade(data.cidadeEmpresa || "");
        setTelefone(data.telefoneEmpresa || "");
        setEmail(data.emailEmpresa || "");
        setDescricao(data.descricaoEmpresa || "");
        setChavePix(data.chavePix || "");
        setDadosBancarios(data.dadosBancarios || "");
      })
      .catch((error: any) => toast.error(error?.response?.data?.mensagem || "Não foi possível carregar os dados da instituição."));
  }, []);
  async function salvar(event: FormEvent) {
    event.preventDefault();
    setSalvando(true);
    try {
      const { data } = await api.put("/administradores/minha", {
        nomeEmpresa: nome,
        cnpjEmpresa: cnpj.replace(/\D/g, ""),
        cidadeEmpresa: cidade,
        telefoneEmpresa: telefone,
        emailEmpresa: email,
        descricaoEmpresa: descricao,
        chavePix,
        dadosBancarios,
      });
      setEmpresa(data.administrador);
      toast.success(data.mensagem);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível salvar.");
    }
    finally {
      setSalvando(false);
    }
  }
  return (<>
    <h1 className="admin-titulo">Minha instituição</h1>
    <p className="admin-subtitulo">Confira e atualize os dados cadastrados pela sua instituição.</p>
    <section className="admin-config-card">
      <form onSubmit={salvar}>
        <div className="admin-config-grid">
          <label>Nome da instituição<input value={nome} onChange={(event) => setNome(event.target.value)} required />
          </label>
          <label>CNPJ<input value={cnpj} onChange={(event) => setCnpj(event.target.value.replace(/\D/g, "").slice(0, 14))} inputMode="numeric" maxLength={14} placeholder="14 números" />
          </label>
          <label>Cidade<input value={cidade} onChange={(event) => setCidade(event.target.value)} />
          </label>
          <label>Telefone<input inputMode="numeric" value={telefone} onChange={(event) => setTelefone(event.target.value.replace(/\D/g, ""))} maxLength={15} placeholder="Somente números" />
          </label>
          <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
        </div>
        <div className="admin-config-grid">
          <label>Chave Pix<input value={chavePix} onChange={(event) => setChavePix(event.target.value)} />
          </label>
          <label>Dados para transferência<textarea value={dadosBancarios} onChange={(event) => setDadosBancarios(event.target.value)} />
          </label>
        </div>
        <label className="admin-config-textarea">Sobre a instituição<textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} />
        </label>
        <button className="admin-botao" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar dados da instituição"}</button>
      </form>
      {empresa && <p className="admin-config-observacao">ID administrativo: {empresa.idAdministrador} · CNPJ: {empresa.cnpjEmpresa || "Não informado"}</p>}
    </section>
  </>);
}
