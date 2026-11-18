import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
export const metadata: Metadata = {
  title: "Corações que Acolhem",
  description: "Plataforma de voluntariado, adoção e doações.",
};
export default function RootLayout({ children, }: Readonly<{
  children: React.ReactNode;
}>) {
  return (<html lang="pt-BR">
    <body>
      <AuthProvider>{children}</AuthProvider>
    </body>
  </html>);
}
