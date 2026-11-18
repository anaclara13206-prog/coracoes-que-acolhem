"use client";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiMail, FiMapPin, FiUsers } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import api from "@/services/api";
import "./Contato.css";
interface Empresa {
  idAdministrador: number;
  nomeEmpresa: string | null;
  cidadeEmpresa: string | null;
  emailEmpresa: string | null;
}
export default function Contato() {
  const { usuario } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresa, setEmpresa] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  useEffect(() => { api.get("/administradores/publicos").then(r => setEmpresas(r.data || [])).catch(() => toast.error("Não foi possível carregar as instituições.")); }, []);
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, [usuario]);
  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!empresa) {
      toast.info("Selecione a instituição que deseja contatar.");
      return;
    } setEnviando(true); try {
      await api.post("/contatos", { nome, email, assunto, mensagem, idUsuario: usuario?.id, idAdministrador: Number(empresa) });
      toast.success("Mensagem enviada para a instituição escolhida!");
      setAssunto("");
      setMensagem("");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível enviar a mensagem.");
    }
    finally {
      setEnviando(false);
    }
  }
  return <>
    <Header />
    <main className="contato-container">
      <div className="contato-shell">
        <section className="contato-intro">
          <p className="form-kicker">Fale com a gente</p>
          <h1>Entre em contato</h1>
          <p>Escolha a instituição parceira e envie sua dúvida, sugestão ou mensagem diretamente para a empresa selecionada.</p>
          <div className="contato-pontos">
            <strong>
              <FiMail /> E-mail geral</strong>
            <p>contato@coracoesqueacolhem.com</p>
            <strong>
              <FiMapPin /> Localização</strong>
            <p>Jales - SP</p>
          </div>
          <div className="contato-referencias">
            <h3>
              <FiUsers /> Instituições cadastradas</h3>{empresas.length === 0 ? <p>Nenhuma instituição parceira cadastrada no momento.</p> : empresas.map(item => <div className="contato-instituicao" key={item.idAdministrador}>
                <strong>{item.nomeEmpresa || "Instituição parceira"}</strong>
                <span>{item.cidadeEmpresa || "Localização não informada"}</span>{item.emailEmpresa && <span>{item.emailEmpresa}</span>}</div>)}</div>
        </section>
        <section className="contato-card">
          <h2>Envie sua mensagem</h2>
          <p className="contato-subtitulo">A mensagem será vinculada à instituição escolhida e ficará disponível no painel administrativo dela.</p>
          <form className="contato-form" onSubmit={enviar}>
            <label className="select-group">
              <span>Instituição de destino</span>
              <select value={empresa} onChange={e => setEmpresa(e.target.value)} required>
                <option value="">Selecione uma instituição</option>{empresas.map(item => <option key={item.idAdministrador} value={item.idAdministrador}>{item.nomeEmpresa || `Instituição ${item.idAdministrador}`}{item.cidadeEmpresa ? ` — ${item.cidadeEmpresa}` : ""}</option>)}</select>
            </label>
            <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Digite seu nome" required />
            <Input label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required />
            <Input label="Assunto" value={assunto} onChange={e => setAssunto(e.target.value)} placeholder="Sobre o que deseja falar?" required />
            <div className="textarea-group">
              <label>Mensagem</label>
              <textarea value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Escreva sua mensagem..." required />
            </div>
            <Button texto={enviando ? "Enviando..." : "Enviar mensagem"} type="submit" />
          </form>
        </section>
      </div>
    </main>
    <Footer />
  </>;
}
