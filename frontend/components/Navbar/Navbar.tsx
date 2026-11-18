"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "./Navbar.css";
interface NavbarProps {
  onNavigate?: () => void;
}
const links = [["/", "Início"], ["/informacoes", "Informações"], ["/doacoes", "Doações"], ["/voluntario", "Voluntariado"], ["/contato", "Contato"]] as const;
export default function Navbar({ onNavigate }: NavbarProps) {
  const pathname = usePathname();
  const { usuario } = useAuth();
  return <nav aria-label="Navegação principal">
    <ul className="menu">
      {links.map(([href, label]) => <li key={href}>
        <Link href={href} className={pathname === href ? "ativo" : ""} onClick={onNavigate}>{label}</Link>
      </li>)}
      {!usuario && <li>
        <Link href="/login" className={pathname === "/login" ? "ativo" : ""} onClick={onNavigate}>Entrar</Link>
      </li>}
    </ul>
  </nav>;
}
