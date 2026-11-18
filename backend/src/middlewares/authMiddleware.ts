import type { Request, Response, NextFunction, } from "express";
import jwt from "jsonwebtoken";
interface DadosToken {
  id: number;
  email: string;
}
export interface RequestAutenticada extends Request {
  usuario?: DadosToken;
}
export function autenticar(req: RequestAutenticada, res: Response, next: NextFunction) {
  const autorizacao = req.headers.authorization;
  if (!autorizacao) {
    return res.status(401).json({
      mensagem: "Token não informado.",
    });
  }
  const partes = autorizacao.split(" ");
  if (partes.length !== 2 ||
    partes[0] !== "Bearer") {
    return res.status(401).json({
      mensagem: "Token inválido.",
    });
  }
  const token = partes[1];
  if (!token) {
    return res.status(401).json({
      mensagem: "Token inválido.",
    });
  }
  const segredo = process.env.JWT_SECRET ||
    "segredo-temporario";
  try {
    const dados = jwt.verify(token, segredo) as DadosToken;
    req.usuario = dados;
    next();
  }
  catch {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}
