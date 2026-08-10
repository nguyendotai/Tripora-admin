import { Sidebar } from "@/shared/components/sidebar";
import { AuthGuard } from "@/shared/components/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-full flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </AuthGuard>
  );
}
