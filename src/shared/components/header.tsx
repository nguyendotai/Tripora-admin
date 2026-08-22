"use client";

import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

export function Header({ title }: { title: string }) {
  const user = useAppSelector((state) => state.auth.user);
  const displayName = user?.firstName ?? user?.email ?? "Admin";
  const roleLabel =
    user?.role === "ADMIN" ? "Quản trị viên" : user?.guideId ? "Hướng dẫn viên" : "Đối tác";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-bold">{title}</h1>

      <div className="flex items-center gap-3">
        <NotificationBell />
        <ThemeToggle />
        <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            {displayName[0]?.toUpperCase()}
          </div>
          <div className="hidden text-sm leading-tight sm:block">
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
