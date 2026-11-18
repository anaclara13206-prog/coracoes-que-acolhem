"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import api from "@/services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo?: string;
  telefone?: string;
}
interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  atualizarUsuario: (usuario: Usuario) => void;
}
const AuthContext = createContext<AuthContextData | undefined>(undefined);
export function AuthProvider({ children }: {
  children: ReactNode;
}) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    const tokenSalvo = window.localStorage.getItem("coracoes_token");
    const usuarioSalvo = window.localStorage.getItem("coracoes_usuario");
    if (!tokenSalvo) {
      setCarregando(false);
      return;
    }
    setToken(tokenSalvo);
    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      }
      catch {
        window.localStorage.removeItem("coracoes_usuario");
      }
    }
    api.get("/usuarios/perfil")
      .then((res) => {
        const u = res.data;
        const normalizado = { id: u.idUsuario, nome: u.nomeUsuario, email: u.emailUsuario, tipo: u.tipoUsuario || "usuario", telefone: u.telefoneUsuario || "" };
        setUsuario(normalizado);
        window.localStorage.setItem("coracoes_usuario", JSON.stringify(normalizado));
      })
      .catch(() => {
        window.localStorage.removeItem("coracoes_token");
        window.localStorage.removeItem("coracoes_usuario");
        setToken(null);
        setUsuario(null);
      })
      .finally(() => setCarregando(false));
  }, []);
  async function login(email: string, senha: string) {
    const { data } = await api.post("/auth/login", { email, senha });
    setToken(data.token);
    setUsuario(data.usuario);
    window.localStorage.setItem("coracoes_token", data.token);
    window.localStorage.setItem("coracoes_usuario", JSON.stringify(data.usuario));
  }
  function logout() {
    setToken(null);
    setUsuario(null);
    window.localStorage.removeItem("coracoes_token");
    window.localStorage.removeItem("coracoes_usuario");
  }
  function atualizarUsuario(novoUsuario: Usuario) {
    setUsuario(novoUsuario);
    window.localStorage.setItem("coracoes_usuario", JSON.stringify(novoUsuario));
  }
  const valor = useMemo(() => ({ usuario, token, carregando, login, logout, atualizarUsuario }), [usuario, token, carregando]);
  return <AuthContext.Provider value={valor}>{children}<ToastContainer position="top-right" autoClose={2800} />
  </AuthContext.Provider>;
}
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto)
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return contexto;
}
