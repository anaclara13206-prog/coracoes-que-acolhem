import "./Doacoes.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CardDoacao from "@/components/CardDoacao/CardDoacao";
export default function Doacoes() {
  return (<>
    <Header />
    <main className="doacoes-container">
      <section className="doacoes-banner">
        <p className="form-kicker">Formas de contribuir</p>
        <h1>Faça uma doação</h1>
        <p>Sua contribuição pode acontecer de diferentes maneiras. Escolha uma forma de participar que faça sentido para você.</p>
      </section>
      <section className="doacoes-cards">
        <CardDoacao icone="◉" titulo="Doação em Dinheiro" descricao="Contribua financeiramente para apoiar projetos sociais e necessidades das instituições parceiras." link="/doacoes/nova?tipo=Dinheiro" />
        <CardDoacao icone="🧸" titulo="Doação de Brinquedos" descricao="Doe brinquedos em bom estado e ajude a levar momentos de alegria e cuidado." link="/doacoes/nova?tipo=Brinquedos" />
        <CardDoacao icone="👕" titulo="Doação de Roupas" descricao="Roupas, calçados e agasalhos em boas condições também podem fazer parte dessa rede." link="/doacoes/nova?tipo=Roupas" />
        <CardDoacao icone="🍎" titulo="Doação de Alimentos" descricao="Doe alimentos não perecíveis para apoiar famílias e instituições parceiras." link="/doacoes/nova?tipo=Alimentos" />
        <CardDoacao icone="⏰" titulo="Doação de Tempo" descricao="Seu tempo, conhecimento e presença também são formas importantes de ajudar." link="/voluntario" />
      </section>
    </main>
    <Footer />
  </>);
}
