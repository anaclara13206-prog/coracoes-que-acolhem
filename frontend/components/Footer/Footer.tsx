import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import "./Footer.css";
export default function Footer() {
  return (<footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <FiHeart /> <strong>Corações que Acolhem</strong>
      </div>
      <p>Uma plataforma pensada para aproximar pessoas, informação e solidariedade.</p>
      <div className="footer-links">
        <Link href="/informacoes">Informações</Link>
        <Link href="/doacoes">Doações</Link>
        <Link href="/voluntario">Voluntariado</Link>
        <Link href="/contato">Contato</Link>
      </div>
    </div>
    <div className="footer-bottom">© 2026 Corações que Acolhem. Projeto acadêmico.</div>
  </footer>);
}
