"use client";
import "./Informacoes.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useEffect, useState } from "react";
import { FiExternalLink, FiBookOpen, FiUsers, FiInfo } from "react-icons/fi";
import api from "@/services/api";

interface InformacaoPublicada {
  idInformacao: number;
  tituloInformacao: string;
  conteudoInformacao: string;
  fonteInformacao?: string | null;
  dataPublicacao?: string | null;
  categoria?: string | null;
  imagemUrl?: string | null;
}
const valores = ["Solidariedade", "Empatia", "Inclusão", "Respeito", "Compromisso"];
const tiposAdocao = [
  ["1. Unilateral", "Ocorre quando o filho de outra relação do cônjuge ou companheiro é adotado, quando não consta o nome de um dos genitores na certidão, ou este tenha perdido o poder familiar. Também pode ocorrer quando o genitor morre e o cônjuge ou companheiro adota o filho."],
  ["2. Legal", "É a forma mais conhecida de adoção. A pessoa ou casal que deseja adotar deve procurar a Vara da Infância e Juventude da comarca em que reside para se habilitar ao processo."],
  ["3. Homoparental", "É realizada por um casal ou uma só pessoa homossexual. O material pesquisado destaca o reconhecimento da união homoafetiva e a possibilidade de adoção por uma única pessoa sem restrição de orientação sexual."],
  ["4. Por testamento e adoção póstuma", "A adoção pós-morte pode ocorrer quando, em vida, a pessoa manifestou essa vontade e iniciou o processo. A adoção puramente por testamento não é permitida."],
  ["5. Bilateral/conjunta", "Regulamentada pelo art. 42, §2º do ECA, exige que os adotantes sejam casados ou mantenham união estável, com comprovação da estabilidade da família. O material também apresenta a situação de ex-companheiros."],
  ["6. De maiores", "Segundo o material pesquisado, é possível a adoção de maior de 18 anos quando já estiver sob guarda ou tutela dos adotantes, observada a diferença mínima de idade indicada no ECA."],
  ["7. Internacional", "É aquela em que os adotantes residem fora do Brasil e está sujeita a procedimentos próprios e regulação específica. É apresentada como medida excepcional após esgotadas as possibilidades de adoção nacional."],
  ["Adoção à brasileira", "O material apresenta esta prática como ilegal: ocorre quando um recém-nascido é entregue para que outras pessoas o registrem como filho, sendo tipificada como crime."],
];
const passosAdocao = [
  ["1º", "Você decidiu adotar", "Procure o Fórum ou a Vara da Infância e da Juventude da sua cidade ou região e reúna a documentação solicitada."],
  ["2º", "Análise de documentos", "Os documentos são autuados pelo cartório e encaminhados para análise e prosseguimento do processo."],
  ["3º", "Avaliação da equipe interprofissional", "A equipe técnica multidisciplinar avalia motivações, expectativas e a realidade sociofamiliar, além de orientar os pretendentes."],
  ["4º", "Programa de preparação para adoção", "A participação no programa de preparação é apresentada no material como requisito legal para quem busca habilitação."],
  ["5º", "Análise do requerimento pela autoridade judiciária", "Com base no estudo psicossocial, preparação e parecer do Ministério Público, o juiz decide sobre a habilitação."],
  ["6º", "Ingresso no Sistema Nacional de Adoção e Acolhimento", "Com o deferimento, os dados do pretendente são inseridos no sistema nacional."],
  ["7º", "Buscando uma família para a criança ou adolescente", "Quando há compatibilidade de perfil, o pretendente é contatado e pode iniciar a aproximação com a criança ou adolescente."],
  ["8º", "O momento de construir novas relações", "Após uma aproximação bem-sucedida, inicia-se o estágio de convivência, acompanhado pela equipe técnica do Judiciário."],
  ["9º", "Uma nova família", "Ao final do estágio de convivência, é proposta a ação de adoção e, sendo favoráveis as condições, o juiz profere a sentença e determina o novo registro de nascimento."],
];
const voluntariadoPontos = [
  ["Conhecer a realidade", "Antes de começar, é importante compreender a complexidade do serviço de acolhimento, sua função e qual será a contribuição do voluntário."],
  ["Adoção", "O trabalho voluntário em um serviço de acolhimento não facilita processos de adoção. Para adoção, é necessário procurar a Vara da Infância e Juventude e informar-se sobre o processo de habilitação."],
  ["Comprometimento", "O voluntário assume compromisso com o serviço e com as crianças e adolescentes e deve se comprometer somente com aquilo que consegue cumprir."],
  ["Formação e supervisão", "A atividade voluntária deve ser planejada e contar com apoio de profissionais da área durante o processo."],
  ["Consciência de seu papel", "O serviço de acolhimento é a casa das crianças e adolescentes. O voluntário deve respeitar a rotina, os espaços e os combinados da instituição."],
  ["Horários", "É necessário cumprir os horários estabelecidos, pois alterações sem aviso podem prejudicar a rotina."],
  ["O que gera transformação", "O material destaca que a constância, e não apenas ações pontuais, ajuda na criação de vínculos estáveis e de confiança."],
  ["Cuidado com o que fala", "O voluntário deve evitar criar falsas expectativas e agir de acordo com seu papel e responsabilidade na vida das crianças e adolescentes."],
  ["Ações pontuais em datas comemorativas", "O material alerta que o excesso de presentes e festas pode criar dificuldades para os serviços e reforçar uma visão limitada das crianças e adolescentes como apenas receptores."],
  ["Doação de coisas usadas", "Itens usados podem ser aproveitados quando estão em bom estado. Objetos quebrados, roupas rasgadas ou livros mofados não são apropriados."],
  ["Festa com voluntários pontuais", "O material questiona ações com muitas pessoas desconhecidas e destaca a importância de atividades responsáveis e que respeitem a rotina do acolhimento."],
];
const referencias = [
  ["Atados", "https://www.atados.com.br/", "Plataforma usada como referência para voluntariado e conexão entre pessoas e organizações."],
  ["Adoção Tardia", "https://orfanatosantaritadecassia.com.br/voluntarios/voluntario/#:~:text=O%20que%20%C3%A9%20ser%20um,toda%20a%20jornada%20como%20volunt%C3%A1rio.", "Conteúdo utilizado como referência sobre voluntariado e participação responsável."],
  ["Adote um Boa Noite — TJSP", "https://www.cnj.jus.br/adote-um-boa-noite-programa-do-tjsp-promoveu-mais-de-70-adocoes-de-adolescentes", "Iniciativa utilizada como referência relacionada ao acolhimento, convivência e adoção."],
  ["AdotApp", "https://www.tjpr.jus.br/noticias/-/asset_publisher/9jZB/content/aplicativo-a-dot-celebra-tres-anos-de-existencia/18319", "Aplicativo utilizado como referência para informações relacionadas à adoção."],
  ["Estatuto da Criança e do Adolescente (ECA)", "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm", "Legislação brasileira que estabelece direitos e garantias para crianças e adolescentes."],
  ["Conselho Nacional de Justiça (CNJ)", "https://www.cnj.jus.br/programas-e-acoes/adocao/", "Informações institucionais sobre adoção e procedimentos relacionados."],
];
export default function Informacoes() {
  const [informacoesPublicadas, setInformacoesPublicadas] = useState<InformacaoPublicada[]>([]);
  const [carregandoInformacoes, setCarregandoInformacoes] = useState(true);
  const [erroInformacoes, setErroInformacoes] = useState<string | null>(null);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarInformacoes() {
      try {
        const resposta = await api.get<InformacaoPublicada[]>('/informacoes');
        if (componenteAtivo) {
          setInformacoesPublicadas(Array.isArray(resposta.data) ? resposta.data : []);
          setErroInformacoes(null);
        }
      } catch {
        if (componenteAtivo) {
          setErroInformacoes('Não foi possível carregar as informações publicadas. Tente novamente mais tarde.');
        }
      } finally {
        if (componenteAtivo) {
          setCarregandoInformacoes(false);
        }
      }
    }

    carregarInformacoes();
    return () => {
      componenteAtivo = false;
    };
  }, []);

  return (<>
    <Header />
    <main className="informacoes-container">
      <section className="informacoes-banner">
        <p className="form-kicker">Conheça o projeto</p>
        <h1>Corações que Acolhem</h1>
        <p>Uma plataforma pensada para aproximar pessoas que desejam ajudar e instituições que precisam de apoio, valorizando o acolhimento e diferentes formas de participação.</p>
      </section>



      <section className="informacoes-card informacoes-resumo">
        <div className="informacoes-bloco">
          <h2>Nossa missão</h2>
          <p>Promover a solidariedade, aproximando voluntários, doadores e instituições por meio da tecnologia e de uma experiência simples e acolhedora.</p>
        </div>
        <div className="informacoes-bloco">
          <h2>Nossa visão</h2>
          <p>Facilitar o encontro entre pessoas e projetos sociais, tornando a participação mais acessível e organizada.</p>
        </div>
        <div className="informacoes-bloco">
          <h2>Nossos valores</h2>
          <div className="valores-grid">{valores.map((v) => <span key={v}>{v}</span>)}</div>
        </div>
        <div className="informacoes-bloco">
          <h2>Como ajudamos?</h2>
          <p>Por meio da plataforma, o usuário pode conhecer formas de contribuição, realizar ações de doação e se cadastrar para participar como voluntário em instituições parceiras.</p>
        </div>
      </section>

      <section className="informacoes-publicadas" aria-labelledby="informacoes-publicadas-titulo">
        <div className="informacoes-publicadas-cabecalho">
          <p className="form-kicker">Novidades das instituições</p>
          <h2 id="informacoes-publicadas-titulo">Informações publicadas</h2>
          <p>Conteúdos cadastrados pelas instituições por meio da área do administrador.</p>
        </div>

        {carregandoInformacoes ? (
          <p className="informacoes-publicadas-mensagem" role="status">Carregando informações...</p>
        ) : erroInformacoes ? (
          <p className="informacoes-publicadas-mensagem informacoes-publicadas-erro" role="alert">{erroInformacoes}</p>
        ) : informacoesPublicadas.length === 0 ? (
          <p className="informacoes-publicadas-mensagem">Ainda não há informações publicadas pelas instituições.</p>
        ) : (
          <div className="informacoes-publicadas-grid">
            {informacoesPublicadas.map((informacao) => (
              <article className="informacao-publicada-card" key={informacao.idInformacao}>
                {informacao.imagemUrl && (
                  <img
                    className="informacao-publicada-imagem"
                    src={informacao.imagemUrl}
                    alt=""
                    loading="lazy"
                  />
                )}
                <div className="informacao-publicada-conteudo">
                  {informacao.categoria && <span className="informacao-publicada-categoria">{informacao.categoria}</span>}
                  <h3>{informacao.tituloInformacao}</h3>
                  <p className="informacao-publicada-texto">{informacao.conteudoInformacao}</p>
                  <div className="informacao-publicada-rodape">
                    {informacao.fonteInformacao && <span>Fonte: {informacao.fonteInformacao}</span>}
                    {informacao.dataPublicacao && (
                      <time dateTime={informacao.dataPublicacao}>
                        {new Date(informacao.dataPublicacao).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                      </time>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="pesquisas-intro">
        <p className="form-kicker">Conteúdo pesquisado</p>
        <h2>Informações sobre adoção, acolhimento e voluntariado</h2>
        <p>Esta área reúne as pesquisas que foram preparadas nos arquivos do trabalho, organizadas por assunto para facilitar a leitura e a consulta.</p>
      </section>

      <section className="pesquisa-secao">
        <div className="pesquisa-cabecalho">
          <FiBookOpen />
          <div>
            <h2>Adoção no Brasil</h2>
          </div>
        </div>
        <div className="pesquisa-destaques">
          <div>
            <strong>4.962</strong>
            <span>crianças e adolescentes disponíveis para adoção, conforme o material pesquisado.</span>
          </div>
          <div>
            <strong>47%</strong>
            <span>das adoções efetivas dos últimos seis anos citadas no material eram de crianças de até três anos.</span>
          </div>
        </div>
        <p className="pesquisa-texto">O material apresenta informações sobre o processo de adoção no Brasil, seus tipos, desafios e etapas. Também destaca que a adoção é regida pela legislação brasileira, incluindo a Lei nº 12.010/2009 e o Estatuto da Criança e do Adolescente.</p>
        <h3>Principais tipos de adoção pesquisados</h3>
        <div className="pesquisa-grid">{tiposAdocao.map(([t, d]) => <article key={t}>
          <h4>{t}</h4>
          <p>{d}</p>
        </article>)}</div>
        <h3>Desafios da adoção</h3>
        <p className="pesquisa-texto">Entre os desafios apresentados estão a burocracia e a demora do processo, a diferença entre o perfil das crianças disponíveis e o perfil desejado pelos adotantes, o preconceito e a falta de informação sobre a adoção de adolescentes e a necessidade de apoio pós-adoção para as famílias.</p>
        <details>
          <summary>Ver o passo a passo da adoção</summary>
          <div className="passos-grid">{passosAdocao.map(([n, t, d]) => <article key={n}>
            <span>{n}</span>
            <div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          </article>)}</div>
          <p className="fonte-pesquisa">Fonte indicada no arquivo: Conselho Nacional de Justiça — passo a passo da adoção.</p>
        </details>
      </section>

      <section className="pesquisa-secao">
        <div className="pesquisa-cabecalho">
          <FiUsers />
          <div>
            <h2>Acolhimento familiar e apoio após o acolhimento</h2>
          </div>
        </div>
        <p className="pesquisa-texto">O material pesquisado apresenta o acolhimento familiar como uma medida temporária para crianças e adolescentes que precisam ser afastados da família de origem. Ele também diferencia acolhimento de adoção e destaca a importância de apoio e preparação para jovens que deixam instituições ao completar 18 anos.</p>
        <div className="pesquisa-destaques pesquisa-destaques-azul">
          <div>
            <strong>34.427</strong>
            <span>crianças e adolescentes acolhidos no Brasil, segundo dados de 2025 citados no arquivo.</span>
          </div>
          <div>
            <strong>93,8%</strong>
            <span>estavam em acolhimento institucional, enquanto 6,2% estavam em acolhimento familiar.</span>
          </div>
        </div>
        <div className="pesquisa-duas-colunas">
          <article>
            <h3>Acolhimento não é adoção</h3>
            <p>O acolhimento ocorre quando crianças e adolescentes de até 18 anos incompletos são afastados da família de origem por diferentes motivos. No acolhimento familiar, eles são recebidos temporariamente por famílias cadastradas, formadas e acompanhadas pelos programas responsáveis.</p>
          </article>
          <article>
            <h3>Apoio a jovens que saem das instituições</h3>
            <p>O arquivo também registra uma proposta de programa de apoio a jovens de 18 a 29 anos que deixam instituições, com ações como moradia temporária, bolsas de estudo, estágio e aprendizagem, atendimento psicossocial, orientação financeira e parcerias.</p>
          </article>
        </div>
      </section>

      <section className="pesquisa-secao">
        <div className="pesquisa-cabecalho">
          <FiInfo />
          <div>
            <h2>Voluntariado em serviços de acolhimento</h2>
          </div>
        </div>
        <p className="pesquisa-texto">A pesquisa destaca que a comunidade pode participar dos cuidados das crianças e adolescentes em parceria com a equipe do serviço de acolhimento, contribuindo para o crescimento pessoal e o fortalecimento da identidade.</p>
        <h3>Pontos importantes para uma atividade voluntária qualificada</h3>
        <div className="pesquisa-grid voluntariado-pesquisa">{voluntariadoPontos.map(([t, d]) => <article key={t}>
          <h4>{t}</h4>
          <p>{d}</p>
        </article>)}</div>
        <h3>O que é ser um voluntário?</h3>
        <p className="pesquisa-texto">Segundo a pesquisa reunida no arquivo, atuar como voluntário envolve colaboração em equipe, disciplina, humildade, iniciativa, comunicação, motivação, empatia, comprometimento, disponibilidade, respeito, abertura a novas experiências e resiliência. A proposta é construir uma troca de conhecimentos e uma atuação responsável.</p>
        <p className="pesquisa-texto">O material também apresenta exemplos de atividades com crianças e adolescentes acolhidos, como brincadeiras ao ar livre, rodas de leitura, jogos e momentos de interação, sempre considerando as orientações e a rotina da instituição.</p>
      </section>

      <section className="pesquisa-secao">
        <div className="pesquisa-cabecalho">
          <FiInfo />
          <div>
            <h2>Participação responsável e rede de apoio</h2>
          </div>
        </div>
        <p className="pesquisa-texto">A participação da comunidade deve respeitar a privacidade, a história e a rotina de cada criança ou adolescente. Antes de iniciar uma atividade voluntária, procure a instituição responsável, conheça as orientações da equipe e combine previamente as tarefas, os horários e os materiais necessários.</p>
        <div className="pesquisa-duas-colunas">
          <article>
            <h3>Respeito e proteção</h3>
            <p>Não divulgue imagens, nomes, histórias pessoais ou informações que permitam identificar crianças e adolescentes sem autorização formal. Siga as regras de proteção e confidencialidade da instituição.</p>
          </article>
          <article>
            <h3>Continuidade do apoio</h3>
            <p>O apoio pode incluir tempo, materiais, recursos financeiros ou divulgação de informações confiáveis. Combine as contribuições com a instituição para que atendam às necessidades reais e possam ser recebidas com segurança.</p>
          </article>
        </div>
        <p className="fonte-pesquisa">Referências complementares: Estatuto da Criança e do Adolescente (Lei nº 8.069/1990) e Conselho Nacional de Justiça.</p>
      </section>

      <section className="referencias-secao">
        <p className="form-kicker">Fontes de referência do projeto</p>
        <h2>Sites pesquisados</h2>
        <p>Os quatro sites abaixo aparecem no arquivo de referências enviado para o projeto.</p>
        <div className="referencias-grid">{referencias.map(([nome, url, desc]) => <a key={url} href={url} target="_blank" rel="noreferrer" className="referencia-card">
          <div>
            <h3>{nome}</h3>
            <p>{desc}</p>
          </div>
          <FiExternalLink />
        </a>)}</div>
      </section>

      <section className="informacoes-frase">
        <h2>Informação também faz parte do cuidado e da participação responsável.</h2>
      </section>
    </main>
    <Footer />
  </>);
}
