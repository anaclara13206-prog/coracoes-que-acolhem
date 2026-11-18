"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Link from "next/link";
import api from "@/services/api";
import "./Cadastro.css";
export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (senha !== confirmacao)
      return toast.error("As senhas não coincidem.");
    setEnviando(true);
    try {
      await api.post("/auth/cadastro", { nome, email, senha, telefone });
      toast.success("Cadastro realizado! Agora você já pode entrar.");
      setTimeout(() => router.push("/login"), 500);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível realizar o cadastro.");
    }
    finally {
      setEnviando(false);
    }
  }
  return <>
    <Header />
    <main className="cadastro-container">
      <div className="cadastro-card">
        <p className="form-kicker">Faça parte da rede</p>
        <h1>Criar conta</h1>
        <p className="cadastro-subtitle">Cadastre seus dados para participar das ações, acompanhar suas inscrições e contribuir com o projeto.</p>
        <form onSubmit={cadastrar}>
          <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome completo" required />
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" required />
          <Input label="Telefone" inputMode="numeric" value={telefone} onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))} placeholder="Somente números" maxLength={15} />
          <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Até 20 caracteres" maxLength={20} required />
          <Input label="Confirmar senha" type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} placeholder="Repita sua senha" maxLength={20} required />
          <Button texto={enviando ? "Cadastrando..." : "Criar minha conta"} type="submit" />
        </form>
        <div className="cadastro-links">
          <p>Já possui uma conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
