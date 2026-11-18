"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import "../Administrador.css";
interface U {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  tipoUsuario: string | null;
  telefoneUsuario: string | null;
}
export default function UsuariosAdmin() {
  const [lista, setLista] = useState<U[]>([]); useEffect(() => { api.get("/usuarios").then(r => setLista(r.data)).catch((e: any) => toast.error(e?.response?.data?.mensagem || "Não foi possível carregar os usuários.")); }, []); return <>
    <h1 className="admin-titulo">Usuários</h1>
    <p className="admin-subtitulo">Usuários cadastrados na plataforma.</p>
    <section className="tabela-admin">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>{lista.length === 0 ? <tr>
          <td colSpan={4}>Nenhum usuário encontrado.</td>
        </tr> : lista.map(u => <tr key={u.idUsuario}>
          <td>{u.nomeUsuario}</td>
          <td>{u.emailUsuario}</td>
          <td>{u.telefoneUsuario || "—"}</td>
          <td>
            <span className="perfil-usuario">{u.tipoUsuario || "usuario"}</span>
          </td>
        </tr>)}</tbody>
      </table>
    </section>
  </>;
}
