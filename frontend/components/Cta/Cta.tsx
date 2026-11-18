import Link from "next/link";
import { FiHeart, FiArrowRight } from "react-icons/fi";
import "./Cta.css";
export default function Cta() {
  return (<section className="cta">
    <div className="cta-icon">
      <FiHeart />
    </div>
    <div>
      <span>Um convite para fazer parte</span>
      <h2>O cuidado começa quando alguém decide participar.</h2>
      <p>Conheça o projeto e descubra uma forma de contribuir que faça sentido para você.</p>
    </div>
    <Link href="/cadastro">Quero fazer parte <FiArrowRight />
    </Link>
  </section>);
}
