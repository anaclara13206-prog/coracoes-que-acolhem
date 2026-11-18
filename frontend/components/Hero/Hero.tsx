import Link from "next/link";
import { FiArrowRight, FiHeart } from "react-icons/fi";
import "./Hero.css";
export default function Hero() {
  return (<section className="hero">
    <div className="hero-inner">
      <div className="hero-content">
        <span className="hero-tag">
          <FiHeart aria-hidden="true" /> Corações que Acolhem</span>
        <p className="hero-kicker">Um jeito simples de transformar vontade de ajudar em atitude.</p>
        <h1>Quando existe cuidado, toda ajuda encontra um caminho.</h1>
        <p className="hero-text">
          Uma plataforma para aproximar pessoas, instituições e iniciativas de acolhimento,
          reunindo informação, voluntariado e diferentes formas de doação em um só lugar.
        </p>
        <div className="hero-buttons">
          <Link href="/cadastro" className="btn-primary">Quero ajudar <FiArrowRight />
          </Link>
          <Link href="/informacoes" className="btn-secondary">Conhecer o projeto</Link>
        </div>
        <div className="hero-note">
          <span>♥</span>
          <p>Tempo, carinho, brinquedos, roupas, alimentos ou contribuição financeira: cada gesto pode ter significado.</p>
        </div>
      </div>

      <div className="hero-image" aria-label="Imagem do projeto">
        <div className="hero-image-frame">
          <img src="/heroPrincipal.webp" alt="Ilustração do projeto Corações que Acolhem" />
        </div>
        <span className="hero-decoration hero-decoration-one" />
        <span className="hero-decoration hero-decoration-two" />
      </div>
    </div>
  </section>);
}
