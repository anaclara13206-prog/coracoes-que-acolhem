import "./CardDoacao.css";
import Button from "../Button/Button";
interface CardDoacaoProps {
  icone: string;
  titulo: string;
  descricao: string;
  link?: string;
}
export default function CardDoacao({ icone, titulo, descricao, link, }: CardDoacaoProps) {
  return (<div className="card-doacao">

    <div className="card-doacao__icone">
      {icone}
    </div>

    <h3>{titulo}</h3>

    <p>{descricao}</p>

    <Button texto="Quero Doar" href={link} />

  </div>);
}
