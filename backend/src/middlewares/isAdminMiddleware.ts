import type { Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import type { RequestAutenticada } from "./authMiddleware.js";
export async function isAdmin(req: RequestAutenticada, res: Response, next: NextFunction) {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }
    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: req.usuario.id },
    });
    if (!usuario || usuario.tipoUsuario !== "administrador") {
      return res.status(403).json({
        mensagem: "Acesso restrito a administradores.",
      });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao verificar permissões.",
    });
  }
}
