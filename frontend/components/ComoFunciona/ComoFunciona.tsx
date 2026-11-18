import { FiArrowRight, FiEdit3, FiHeart, FiUsers } from "react-icons/fi";
import "./ComoFunciona.css";
const passos = [
  { numero: "01", icon: FiEdit3, titulo: "Conheça", texto: "Acesse informações e entenda as diferentes formas de participação." },
  { numero: "02", icon: FiUsers, titulo: "Escolha", texto: "Decida como contribuir de acordo com o seu tempo e suas possibilidades." },
  { numero: "03", icon: FiHeart, titulo: "Participe", texto: "Cadastre-se e faça parte de uma rede construída com cuidado e solidariedade." },
];
export default function ComoFunciona() {
  return (<section className="como-funciona">
    <div className="como-inner">
      <div className="como-title">
        <span>Passo a passo</span>
        <h2>Começar pode ser mais simples do que parece.</h2>
      </div>
      <div className="passos">
        {passos.map(({ numero, icon: Icon, titulo, texto }, index) => (<div className="passo" key={numero}>
          <div className="passo-topo">
            <span>{numero}</span>
            <Icon />
          </div>
          <h3>{titulo}</h3>
          <p>{texto}</p>
          {index < passos.length - 1 && <FiArrowRight className="passo-arrow" aria-hidden="true" />}
        </div>))}
      </div>
    </div>
  </section>);
}
