"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiBookOpen, FiHeart, FiHome, FiInfo, FiMail, FiSettings, FiUsers, FiUserCheck } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import "./Sidebar.css";
const links = [
  ["/administrador", "Dashboard", FiHome],
  ["/administrador/voluntarios", "Voluntários", FiUserCheck],
  ["/administrador/questionarios", "Questionários", FiBookOpen],
  ["/administrador/doacoes", "Doações", FiHeart],
  ["/administrador/contatos", "Contatos", FiMail],
  ["/administrador/usuarios", "Usuários", FiUsers],
  ["/administrador/informacoes", "Informações", FiInfo],
  ["/administrador/configuracoes", "Minha instituição", FiSettings],
] as const;
export default function Sidebar() {
  const pathname = usePathname(); const { usuario } = useAuth(); return <aside className="sidebar">
    <div className="sidebar-brand">
      <span>
        <FiHeart />
      </span>
      <div>
        <strong>Corações que</strong>
        <small>Acolhem</small>
      </div>
    </div>
    <div className="sidebar-admin">
      <FiBarChart2 />
      <div>
        <span>Painel da instituição</span>
        <strong>{usuario?.nome?.split(" ")[0] || "Administrador"}</strong>
      </div>
    </div>
    <nav>{links.map(([href, label, Icon]) => <Link key={href} href={href} className={pathname === href || pathname.startsWith(`${href}/`) ? "ativo" : ""}>
      <Icon />
      <span>{label}</span>
    </Link>)}</nav>
    <Link className="sidebar-voltar" href="/">
      <span>Voltar ao site</span> →</Link>
  </aside>;
}
