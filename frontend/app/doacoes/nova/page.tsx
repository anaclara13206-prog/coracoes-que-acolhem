"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import "./NovaDoacao.css";
const tipos = ["Dinheiro", "Brinquedos", "Roupas", "Alimentos", "Tempo"];
function campoPix(id: string, valor: string) {
  return `${id}${String(valor.length).padStart(2, "0")}${valor}`;
}
function montarPayloadPix(chave: string, nomeInstituicao: string, cidade: string, valor: string) {
  const nome = nomeInstituicao.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^A-Za-z0-9 ]/g, "").slice(0, 25).toUpperCase() || "INSTITUICAO";
  const local = cidade.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^A-Za-z0-9 ]/g, "").slice(0, 15).toUpperCase() || "BRASIL";
  const conta = campoPix("00", "br.gov.bcb.pix") + campoPix("01", chave.trim());
  const valorCampo = Number(valor) > 0 ? campoPix("54", Number(valor).toFixed(2)) : "";
  const adicional = campoPix("62", campoPix("05", "***"));
  const base = "000201" + "010211" + campoPix("26", conta) + "52040000" + "5303986" + valorCampo + "5802BR" + campoPix("59", nome) + campoPix("60", local) + adicional + "6304";
  let crc = 0xffff;
  for (let i = 0; i < base.length; i++) {
    crc ^= base.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return base + crc.toString(16).toUpperCase().padStart(4, "0");
}
interface Empresa {
  idAdministrador: number;
  nomeEmpresa: string | null;
  cidadeEmpresa: string | null;
  chavePix?: string | null;
  dadosBancarios?: string | null;
}
export default function NovaDoacao() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [tipo, setTipo] = useState("Dinheiro");
  const [valor, setValor] = useState("");
  const [pagamento, setPagamento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [comprovanteUrl, setComprovanteUrl] = useState("");
  const [nomeComprovante, setNomeComprovante] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [enviando, setEnviando] = useState(false);
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tipo");
    if (t && tipos.includes(t))
      setTipo(t);
    api.get("/administradores/publicos")
      .then((r) => setEmpresas(r.data || []))
      .catch(() => toast.error("Não foi possível carregar as instituições."));
  }, []);
  const empresaSelecionada = empresas.find((item) => String(item.idAdministrador) === empresa);
  const pixPayload = empresaSelecionada?.chavePix
    ? montarPayloadPix(empresaSelecionada.chavePix, empresaSelecionada.nomeEmpresa || "Instituicao", empresaSelecionada.cidadeEmpresa || "Brasil", valor)
    : "";
  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!usuario) {
      toast.info("Entre na sua conta para registrar uma doação.");
      return;
    }
    if (!empresa) {
      toast.info("Escolha a instituição que receberá a doação.");
      return;
    }
    if (tipo === "Dinheiro" && !pagamento) {
      toast.info("Selecione a forma de pagamento.");
      return;
    }
    if (tipo === "Dinheiro" && pagamento === "Pix" && !empresaSelecionada?.chavePix) {
      toast.error("A instituição ainda não cadastrou uma chave Pix. Escolha transferência ou entre em contato com ela.");
      return;
    }
    if (tipo === "Dinheiro" && pagamento === "Transferência" && !empresaSelecionada?.dadosBancarios) {
      toast.error("A instituição ainda não cadastrou os dados bancários. Entre em contato com ela antes de transferir.");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/doacoes", {
        tipoDoacao: tipo,
        valor: valor ? Number(valor) : undefined,
        tipoPagamento: pagamento || undefined,
        descricao: descricao || undefined,
        comprovanteUrl: comprovanteUrl || undefined,
        idAdministrador: Number(empresa),
      });
      toast.success("Solicitação registrada como pendente. A instituição confirmará após verificar o recebimento.");
      router.push("/perfil");
    }
    catch (error: any) {
      toast.error(error?.response?.data?.mensagem || "Não foi possível registrar a doação.");
    }
    finally {
      setEnviando(false);
    }
  }
  return (<>
    <Header />
    <main className="nova-doacao-container">
      <section className="nova-doacao-card">
        <p className="form-kicker">Um gesto de cuidado</p>
        <h1>Registrar uma doação</h1>
        <p className="nova-doacao-subtitulo">Escolha a instituição, a forma de contribuição e registre sua solicitação.</p>
        {!usuario && <div className="nova-doacao-aviso">Para registrar a doação, <Link href="/login">entre na sua conta</Link> ou <Link href="/cadastro">crie seu cadastro</Link>.</div>}
        <form onSubmit={enviar}>
          <label className="select-group">
            <span>Instituição de destino</span>
            <select value={empresa} onChange={(e) => setEmpresa(e.target.value)} required>
              <option value="">Selecione uma instituição</option>
              {empresas.map((e) => <option key={e.idAdministrador} value={e.idAdministrador}>{e.nomeEmpresa || `Instituição ${e.idAdministrador}`}{e.cidadeEmpresa ? ` — ${e.cidadeEmpresa}` : ""}</option>)}
            </select>
          </label>
          <label className="select-group">
            <span>Tipo de doação</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {tipos.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          {tipo === "Dinheiro" && <>
            <Input label="Valor (R$)" type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex.: 50,00" min={0.01} step="0.01" required />
            <label className="select-group">
              <span>Forma de pagamento</span>
              <select value={pagamento} onChange={(e) => setPagamento(e.target.value)} required>
                <option value="">Selecione uma opção</option>
                <option>Pix</option>
                <option>Transferência</option>
                <option>Outro</option>
              </select>
            </label>
          </>}
          {tipo === "Dinheiro" && pagamento === "Pix" && <div className="dados-pagamento">
            <h2>Pagamento por Pix</h2>
            {empresaSelecionada?.chavePix ? <>
              <p>Escaneie o QR Code pelo aplicativo do seu banco e confira cuidadosamente o nome da instituição e o valor antes de confirmar.</p>
              <img className="pix-qr" alt="QR Code Pix para pagamento da doação" src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(pixPayload)}`} />
              <p>
                <strong>Chave Pix:</strong> {empresaSelecionada.chavePix}</p>
              <details className="pix-copia-cola">
                <summary>Mostrar código Pix Copia e Cola</summary>
                <textarea readOnly value={pixPayload} aria-label="Código Pix Copia e Cola" />
                <button type="button" onClick={() => { void navigator.clipboard?.writeText(pixPayload).then(() => toast.success("Código Pix copiado.")).catch(() => toast.info("Selecione e copie o código manualmente.")); }}>Copiar código Pix</button>
              </details>
            </> : <p>A instituição ainda não cadastrou uma chave Pix. Entre em contato com ela antes de realizar o pagamento.</p>}
            <small>O QR Code é gerado a partir da chave Pix e do valor informado. A plataforma não recebe confirmação automática do banco: a doação permanece pendente até a instituição verificar o recebimento.</small>
          </div>}
          {tipo === "Dinheiro" && pagamento === "Transferência" && <div className="dados-pagamento">
            <h2>Dados para transferência</h2>
            {empresaSelecionada?.dadosBancarios ? <p className="dados-transferencia">{empresaSelecionada.dadosBancarios}</p> : <p>A instituição ainda não cadastrou os dados bancários. Entre em contato com ela antes de transferir.</p>}
            <small>Depois de realizar a transferência, envie a solicitação. A doação só será confirmada quando a instituição verificar o recebimento.</small>
          </div>}
          <label className="select-group comprovante-upload">
            <span>Comprovante (opcional — imagem ou PDF, até 2 MB)</span>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => {
              const file = e.target.files?.[0]; if (!file) {
                setComprovanteUrl("");
                setNomeComprovante("");
                return;
              } if (file.size > 2 * 1024 * 1024) {
                toast.error("O comprovante deve ter no máximo 2 MB.");
                e.target.value = "";
                return;
              } if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
                toast.error("Envie uma imagem ou arquivo PDF.");
                e.target.value = "";
                return;
              } const reader = new FileReader(); reader.onload = () => { setComprovanteUrl(String(reader.result || "")); setNomeComprovante(file.name); }; reader.onerror = () => toast.error("Não foi possível ler o comprovante."); reader.readAsDataURL(file);
            }} />
            <small>{nomeComprovante ? `Arquivo selecionado: ${nomeComprovante}` : "Anexe o comprovante se já realizou o pagamento."}</small>
          </label>
          <div className="textarea-group">
            <label>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder={tipo === "Dinheiro" ? "Se desejar, acrescente alguma observação..." : "Descreva o que pretende doar e combine a entrega com a instituição."} />
          </div>
          <Button texto={enviando ? "Enviando..." : "Enviar solicitação de doação"} type="submit" />
          <p className="voltar-doacoes">
            <Link href="/doacoes">← Voltar para todas as formas de doação</Link>
          </p>
        </form>
      </section>
    </main>
    <Footer />
  </>);
}
