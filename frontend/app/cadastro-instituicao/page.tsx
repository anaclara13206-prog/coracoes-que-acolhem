"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import api from "@/services/api";
import "../cadastro/Cadastro.css";
export default function CadastroInstituicao() {
  const router = useRouter();
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  async function enviar(e: FormEvent) {
    e.preventDefault(); setEnviando(true); try {
      await api.post("/auth/cadastro-instituicao", { nomeEmpresa, cnpjEmpresa: cnpj.replace(/\D/g, ""), cidadeEmpresa: cidade, telefoneEmpresa: telefone.replace(/\D/g, ""), emailEmpresa: email, senha, descricaoEmpresa: descricao });
      toast.success("Instituição cadastrada! Agora você já pode entrar.");
      setTimeout(() => router.push("/login"), 700);
    }
      catch (error: any) {
        toast.error(error?.response?.data?.mensagem || "Não foi possível cadastrar a instituição.");
      }
      finally {
        setEnviando(false);
      }
  }
  return <>
    <Header />
    <main className="cadastro-container">
      <section className="cadastro-card">
        <p className="form-kicker">Área institucional</p>
        <h1>Cadastrar instituição</h1>
        <p className="cadastro-subtitle">Crie a conta administrativa da empresa ou instituição que participará da rede.</p>
        <form onSubmit={enviar}>
          <Input label="Nome da instituição" value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)} required />
          <Input label="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value.replace(/\D/g, "").slice(0, 14))} inputMode="numeric" maxLength={14} minLength={14} placeholder="Somente números (14 dígitos)" required />
          <Input label="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex.: Jales - SP" />
          <Input label="Telefone" inputMode="numeric" value={telefone} onChange={e => setTelefone(e.target.value.replace(/\D/g, ""))} placeholder="Somente números" maxLength={15} />
          <Input label="E-mail institucional" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Senha" type="password" minLength={6} maxLength={20} value={senha} onChange={e => setSenha(e.target.value)} required />
          <div className="textarea-group">
            <label>Sobre a instituição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Conte brevemente sobre a instituição..." />
          </div>
          <Button texto={enviando ? "Cadastrando..." : "Cadastrar instituição"} type="submit" />
        </form>
        <div className="cadastro-links">
          <p>Já possui uma conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
