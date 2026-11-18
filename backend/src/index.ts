import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import contatoRoutes from "./routes/contatoRoutes.js";
import doacaoRoutes from "./routes/doacaoRoutes.js";
import informacaoRoutes from "./routes/informacaoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import voluntarioRoutes from "./routes/voluntarioRoutes.js";
import administradorRoutes from "./routes/administradorRoutes.js";
import questionarioRoutes from "./routes/questionarioRoutes.js";
import prisma from "./lib/prisma.js";
const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin))
      return callback(null, true);
    return callback(new Error("Origem não autorizada pelo CORS."));
  },
  credentials: true,
}));
app.use(express.json({ limit: "3mb" }));
app.get("/", (_req, res) => {
  res.json({ mensagem: "Backend Corações que Acolhem funcionando!" });
});
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ servidor: "ok", banco: "conectado" });
  }
  catch (error) {
    return res.status(500).json({
      servidor: "ok",
      banco: "erro",
      mensagem: error instanceof Error ? error.message : "Erro ao conectar ao banco.",
    });
  }
});
app.use("/auth", authRoutes);
app.use("/contatos", contatoRoutes);
app.use("/doacoes", doacaoRoutes);
app.use("/informacoes", informacaoRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/voluntarios", voluntarioRoutes);
app.use("/administradores", administradorRoutes);
app.use("/questionarios", questionarioRoutes);
app.use((_req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ mensagem: "Erro interno do servidor." });
});
const PORT = Number(process.env.PORT) || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("A estrutura do banco existente será utilizada; nenhuma tabela será criada ou alterada automaticamente.");
});
