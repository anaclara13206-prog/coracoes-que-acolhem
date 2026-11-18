import Link from "next/link";
import { FiGift, FiHeart, FiHome, FiArrowUpRight } from "react-icons/fi";
import "./Servicos.css";
const servicos = [
  { icon: FiGift, cor: "rosa", titulo: "Doações", texto: "Dinheiro, brinquedos, roupas, alimentos e outros itens podem atender necessidades diferentes.", href: "/doacoes" },
  { icon: FiHeart, cor: "azul", titulo: "Voluntariado", texto: "Doe tempo, conhecimento e presença em ações de apoio e acolhimento.", href: "/voluntario" },
  { icon: FiHome, cor: "laranja", titulo: "Informação", texto: "Encontre conteúdos sobre acolhimento, adoção e formas responsáveis de participar.", href: "/informacoes" },
];
export default function Servicos() {
  return (<section className="servicos">
    <div className="section-heading">
      <span>Formas de participar</span>
      <h2>Você pode ajudar de muitas maneiras.</h2>
      <p>Escolha a forma que combina com o que você pode oferecer hoje.</p>
    </div>
    <div className="cards">
      {servicos.map(({ icon: Icon, cor, titulo, texto, href }) => (<article className={`card-servico ${cor}`} key={titulo}>
        <div className="icone">
          <Icon aria-hidden="true" />
        </div>
        <h3>{titulo}</h3>
        <p>{texto}</p>
        <Link href={href}>Saiba mais <FiArrowUpRight />
        </Link>
      </article>))}
    </div>
  </section>);
}
