import Image from "next/image";
import Link from "next/link";
import "./Logo.css";
export default function Logo() {
  return (<Link href="/" className="logo" aria-label="Corações que Acolhem — página inicial">
    <Image src="/Logo Header.webp" alt="Logo Corações que Acolhem" width={150} height={72} priority className="logo-imagem" />
  </Link>);
}
