'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  MapPinned,
  LogOut,
} from 'lucide-react';
import { buttonVariants } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/logo';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useLogoutMutation, clearCredentials, clearAuthStorage, type AuthUser } from '@/features/auth';
import { cn } from '@/shared/lib/utils';

/** "Properties" trỏ khác route theo Role: Admin duyệt Property của mọi Partner, Partner tự quản lý Property của mình — xem admin/CLAUDE.md mục 1. */
function getNavGroups(role: AuthUser['role'] | undefined) {
  const isPartner = role === 'PARTNER';

  return [
    {
      label: 'Tổng quan',
      items: [{ icon: LayoutDashboard, label: 'Dashboard', href: '/' }],
    },
    {
      label: 'Discovery',
      items: [{ icon: MapPinned, label: 'Destinations', href: '/destinations' }],
    },
    {
      label: 'Marketplace',
      items: [
        isPartner
          ? { icon: Building2, label: 'Property của tôi', href: '/properties/mine' }
          : { icon: Building2, label: 'Properties', href: '/properties' },
        { icon: CalendarCheck, label: 'Bookings', href: null },
      ],
    },
    {
      label: 'Tài chính',
      items: [{ icon: Wallet, label: 'Commission & Payout', href: null }],
    },
    {
      label: 'Quản trị',
      items: [{ icon: ShieldCheck, label: 'Roles & Permissions', href: null }],
    },
  ] as const;
}

/** Sidebar cố định tối ở cả 2 theme (chrome thương hiệu) — xem admin/CLAUDE.md mục 7.1/7.3. */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();
  const navGroups = getNavGroups(user?.role);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // best-effort — vẫn đăng xuất phía client dù API lỗi
    }
    dispatch(clearCredentials());
    clearAuthStorage();
    router.replace('/login');
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 bg-sidebar px-4 py-6 text-sidebar-foreground">
      <div className="flex items-center gap-2 px-2">
        <Logo textClassName="text-white" />
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
              {group.label}
            </span>
            {group.items.map(({ icon: Icon, label, href }) => {
              const active = href ? pathname === href : false;
              const itemClassName = `flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 text-sm ${
                active ? 'bg-sidebar-active text-primary' : 'text-sidebar-foreground'
              }`;

              if (!href) {
                return (
                  <div key={label} className={`${itemClassName} cursor-not-allowed opacity-40`}>
                    <Icon className="size-4" />
                    {label}
                  </div>
                );
              }

              return (
                <Link key={label} href={href} className={itemClassName}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-3 border-t border-sidebar-border pt-4">
        {user && (
          <div className="px-2 text-xs">
            <p className="truncate font-medium text-white">{user.email}</p>
            <p className="text-sidebar-foreground/60">{user.role}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full border-primary text-primary')}
        >
          <LogOut className="size-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
