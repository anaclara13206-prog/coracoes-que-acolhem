import "./Button.css";
import Link from "next/link";
interface ButtonProps {
  texto: string;
  type?: "button" | "submit";
  href?: string;
  variante?: "rosa" | "azul";
}
export default function Button({ texto, type = "button", href, variante = "rosa", }: ButtonProps) {
  const className = `button button-${variante}`;
  if (href) {
    return (<Link href={href} className={className}>
      {texto}
    </Link>);
  }
  return (<button className={className} type={type}>
    {texto}
  </button>);
}
