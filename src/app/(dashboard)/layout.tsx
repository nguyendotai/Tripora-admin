import { AuthGuard } from "@/shared/components/auth-guard";
import { Sidebar } from "@/shared/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="pl-64">
        <Sidebar />
        {children}
      </div>
    </AuthGuard>
  );
}
