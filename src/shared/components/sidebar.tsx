"use client";

import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Map,
  MessageSquareText,
  Newspaper,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/api/auth.api";
import { clearSession } from "@/features/auth/services/auth-storage";
import { logout } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { Logo } from "./logo";

const NAV_GROUPS = [
  {
    label: "Tổng quan",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Quản lý nội dung",
    items: [
      { href: "/destinations", label: "Điểm đến", icon: Map },
      { href: "/guides", label: "Cẩm nang", icon: BookOpen },
      { href: "/blog", label: "Blog", icon: Newspaper },
      { href: "/reviews", label: "Đánh giá", icon: MessageSquareText },
    ],
  },
  {
    label: "Người dùng",
    items: [{ href: "/users", label: "Users", icon: Users }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // ignore — clear local session regardless
    }
    clearSession();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center px-5">
        <Logo light />
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-white/5 px-3 py-2 text-sm text-sidebar-foreground/70">
          <Search className="h-4 w-4" />
          <span>Tìm kiếm...</span>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-xs font-medium tracking-wider text-sidebar-foreground/40 uppercase">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <Button
          variant="outline"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="w-full justify-center rounded-full border-sidebar-primary/40 text-sidebar-primary hover:bg-white/5"
        >
          <LogOut className="mr-1.5 h-4 w-4" /> Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
