import { BookOpen, Map, MessageSquareText, Users } from "lucide-react";
import { RecentUsersCard } from "@/modules/dashboard/components/recent-users-card";
import { SignupsChart } from "@/modules/dashboard/components/signups-chart";
import { StatCard } from "@/modules/dashboard/components/stat-card";
import { Header } from "@/shared/components/header";
import { Sidebar } from "@/shared/components/sidebar";

const STATS = [
  { icon: Users, label: "Người dùng", value: 0 },
  { icon: Map, label: "Điểm đến", value: 0 },
  { icon: BookOpen, label: "Cẩm nang", value: 0 },
  { icon: MessageSquareText, label: "Đánh giá", value: 0 },
];

export default function DashboardPage() {
  return (
    <div className="pl-64">
      <Sidebar />
      <Header title="Dashboard" />

      <main className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              caption="Chưa có dữ liệu"
            />
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SignupsChart />
          </div>
          <RecentUsersCard />
        </div>
      </main>
    </div>
  );
}
