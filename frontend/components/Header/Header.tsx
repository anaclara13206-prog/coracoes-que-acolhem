"use client";
import { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiLogOut, FiMenu, FiShield, FiUser, FiX } from "react-icons/fi";
import Logo from "../Logo/Logo";
import Navbar from "../Navbar/Navbar";
import Button from "../Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import "./Header.css";
export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const { usuario, logout } = useAuth();
  function sair() { setPerfilAberto(false); setMenuAberto(false); logout(); }
  return (<header className="header">
    <div className="header-container">
      <Logo />
      <button type="button" className="menu-mobile" aria-label={menuAberto ? "Fechar menu" : "Abrir menu"} aria-expanded={menuAberto} onClick={() => setMenuAberto((aberto) => !aberto)}>
        {menuAberto ? <FiX /> : <FiMenu />}
      </button>
      <div className={`header-navigation ${menuAberto ? "aberto" : ""}`}>
        <Navbar onNavigate={() => { setMenuAberto(false); setPerfilAberto(false); }} />
        {!usuario ? (<Button texto="Quero ajudar" href="/cadastro" variante="rosa" />) : (<div className="usuario-menu">
          <button type="button" className="usuario-menu-botao" onClick={() => setPerfilAberto((aberto) => !aberto)} aria-expanded={perfilAberto}>
            <span className="usuario-avatar">
              <FiUser />
            </span>
            <span className="usuario-nome">{usuario.nome.split(" ")[0]}</span>
            <FiChevronDown className={perfilAberto ? "girado" : ""} />
          </button>
          {perfilAberto && (<div className="usuario-dropdown">
            <Link href="/perfil" onClick={() => { setPerfilAberto(false); setMenuAberto(false); }}>
              <FiUser /> Meu perfil</Link>
            {usuario.tipo === "administrador" && <Link href="/administrador" onClick={() => { setPerfilAberto(false); setMenuAberto(false); }}>
              <FiShield /> Área administrativa</Link>}
            <button type="button" onClick={sair}>
              <FiLogOut /> Sair da conta</button>
          </div>)}
        </div>)}
      </div>
    </div>
  </header>);
}
