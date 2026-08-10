import { ThemeToggle } from "@/shared/components/theme-toggle";

export default function DashboardPage() {
  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">
            Tripora Admin đang trong giai đoạn khởi tạo dự án — Dashboard/Stat Card/Data Table
            thật sẽ được xây dựng theo <code>admin/CLAUDE.md</code> mục 7.
          </p>
        </div>
      </main>
    </>
  );
}
