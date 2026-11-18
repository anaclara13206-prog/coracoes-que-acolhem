import { FiHeart, FiUsers } from "react-icons/fi";
import "./Sobre.css";
export default function Sobre() {
  return (<section className="sobre">
    <div className="sobre-container">
      <div className="sobre-image">
        <img src="/sobreHome.webp" alt="Representação do projeto Corações que Acolhem" />
      </div>
      <div className="sobre-content">
        <span className="sobre-tag">
          <FiUsers /> Sobre a proposta</span>
        <h2>Uma ponte entre quem quer ajudar e quem precisa de apoio.</h2>
        <p>
          O Corações que Acolhem foi pensado para reunir, em um ambiente acolhedor,
          informações e caminhos de participação social ligados ao acolhimento de crianças e adolescentes.
        </p>
        <p>
          A ideia é valorizar diferentes formas de contribuição. Nem toda ajuda precisa ser financeira:
          tempo, atenção, conhecimento, brinquedos, roupas e alimentos também podem fazer parte dessa rede.
        </p>
        <div className="sobre-destaque">
          <FiHeart />
          <span>Informação também é uma forma de cuidado.</span>
        </div>
      </div>
    </div>
  </section>);
}
