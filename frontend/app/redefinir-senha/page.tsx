"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import api from "@/services/api";
import "../esqueci-senha/Senha.css";
export default function RedefinirSenha() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  useEffect(() => { const t = new URLSearchParams(window.location.search).get("token") || ""; setToken(t); }, []);
  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (senha !== confirmacao) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setEnviando(true);
    try {
      const { data } = await api.post("/auth/redefinir-senha", { token, novaSenha: senha });
      toast.success(data.mensagem);
      setTimeout(() => router.push("/login"), 700);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível alterar a senha.");
    }
    finally {
      setEnviando(false);
    }
  }
  return <>
    <Header />
    <main className="senha-container">
      <section className="senha-card">
        <p className="form-kicker">Novo acesso</p>
        <h1>Redefinir senha</h1>
        <p>Crie uma nova senha para voltar a acessar sua conta.</p>
        <form onSubmit={enviar}>
          <Input label="Nova senha" type="password" minLength={6} maxLength={20} value={senha} onChange={e => setSenha(e.target.value)} required />
          <Input label="Confirmar nova senha" type="password" minLength={6} maxLength={20} value={confirmacao} onChange={e => setConfirmacao(e.target.value)} required />
          <Button texto={enviando ? "Salvando..." : "Alterar senha"} type="submit" />
        </form>
        <div className="senha-voltar">
          <Link href="/login">Voltar para o login</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
