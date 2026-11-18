"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import "./Login.css";
export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnviando(true);
    try {
      await login(email, senha);
      toast.success("Login realizado com sucesso!");
      router.push("/perfil");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "E-mail ou senha inválidos.");
    }
    finally {
      setEnviando(false);
    }
  }
  return <>
    <Header />
    <main className="login-container">
      <div className="login-card">
        <p className="form-kicker">Bem-vindo de volta</p>
        <h1>Entrar</h1>
        <p className="login-subtitle">Acesse sua conta para acompanhar suas participações no projeto.</p>
        <form onSubmit={entrar}>
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" required />
          <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" required />
          <Button texto={enviando ? "Entrando..." : "Entrar"} type="submit" />
        </form>
        <div className="login-links">
          <p>
            <Link href="/esqueci-senha">Esqueci minha senha</Link>
          </p>
          <p>Ainda não possui uma conta? <Link href="/cadastro">Cadastre-se</Link>
          </p>
          <p>É uma instituição? <Link href="/cadastro-instituicao">Cadastre sua instituição</Link>
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
