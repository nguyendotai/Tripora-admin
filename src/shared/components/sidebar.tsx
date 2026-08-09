import { LayoutDashboard, Building2, CalendarCheck, Wallet, ShieldCheck } from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Tổng quan',
    items: [{ icon: LayoutDashboard, label: 'Dashboard', active: true }],
  },
  {
    label: 'Marketplace',
    items: [
      { icon: Building2, label: 'Partner & Property', active: false },
      { icon: CalendarCheck, label: 'Bookings', active: false },
    ],
  },
  {
    label: 'Tài chính',
    items: [{ icon: Wallet, label: 'Commission & Payout', active: false }],
  },
  {
    label: 'Quản trị',
    items: [{ icon: ShieldCheck, label: 'Roles & Permissions', active: false }],
  },
];

/** Sidebar cố định tối ở cả 2 theme (chrome thương hiệu) — xem admin/CLAUDE.md mục 7.1/7.3. */
export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 bg-sidebar px-4 py-6 text-sidebar-foreground">
      <div className="flex items-center gap-2 px-2">
        <span className="text-lg font-bold text-white">
          Tripora <span className="text-primary">Admin</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
              {group.label}
            </span>
            {group.items.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 text-sm ${
                  active ? 'bg-sidebar-active text-primary' : 'text-sidebar-foreground'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
