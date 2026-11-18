import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Sobre from "@/components/Sobre/Sobre";
import ComoFunciona from "@/components/ComoFunciona/ComoFunciona";
import Servicos from "@/components/Servicos/Servicos";
import Estatisticas from "@/components/Estatisticas/Estatisticas";
import Cta from "@/components/Cta/Cta";
import Footer from "@/components/Footer/Footer";
export default function Home() {
  return (<>
    <Header />

    <main>
      <Hero />
      <Sobre />
      <ComoFunciona />
      <Servicos />
      <Estatisticas />
      <Cta />
    </main>

    <Footer />
  </>);
}
