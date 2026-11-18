"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import api from "@/services/api";
import "./Senha.css";
export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [link, setLink] = useState("");
  async function enviar(e: FormEvent) {
    e.preventDefault(); setEnviando(true); setLink(""); try {
      const { data } = await api.post("/auth/esqueci-senha", { email });
      toast.success(data.mensagem);
      if (data.link)
        setLink(data.link);
    }
      catch (error: any) {
        toast.error(error?.response?.data?.mensagem || "Não foi possível iniciar a recuperação.");
      }
      finally {
        setEnviando(false);
      }
  }
  return <>
    <Header />
    <main className="senha-container">
      <section className="senha-card">
        <p className="form-kicker">Recuperação de acesso</p>
        <h1>Esqueci minha senha</h1>
        <p>Informe o e-mail usado no cadastro. Em ambiente de apresentação, o link de recuperação aparece aqui para que você possa testar o fluxo completo.</p>
        <form onSubmit={enviar}>
          <Input label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="voce@email.com" />
          <Button texto={enviando ? "Preparando..." : "Enviar recuperação"} type="submit" />
        </form>{link && <div className="senha-link">
          <strong>Link de recuperação para demonstração:</strong>
          <Link href={link}>Abrir redefinição de senha</Link>
        </div>}<div className="senha-voltar">
          <Link href="/login">Voltar para o login</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
