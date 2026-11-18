"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
export default function AdminGuard({ children }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { usuario, carregando } = useAuth();
  useEffect(() => {
    if (!carregando && (!usuario || usuario.tipo !== "administrador"))
      router.replace("/login");
  }, [carregando, usuario, router]);
  if (carregando || !usuario || usuario.tipo !== "administrador")
    return <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#fbfaf9",
      color: "#6e646b"
    }}>Verificando acesso...</div>;
  return <>{children}</>;
}
