import Sidebar from "@/components/Sidebar/Sidebar";
import AdminGuard from "@/components/AdminGuard/AdminGuard";
import "./Administrador.css";
export default function AdministradorLayout({ children }: {
  children: React.ReactNode;
}) {
  return <AdminGuard>
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  </AdminGuard>;
}
