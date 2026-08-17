"use client";

import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarCheck,
  Car,
  Compass,
  CreditCard,
  Footprints,
  LayoutDashboard,
  LogOut,
  Map,
  Megaphone,
  MessageSquareText,
  Newspaper,
  Percent,
  Plane,
  PlaneTakeoff,
  Route,
  Search,
  ShieldCheck,
  Tag,
  Ticket,
  UserCircle,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/api/auth.api";
import { clearSession } from "@/features/auth/services/auth-storage";
import { logout } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { Logo } from "./logo";

const ADMIN_NAV_GROUPS = [
  {
    label: "Tổng quan",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/reports", label: "Báo cáo", icon: BarChart3 },
    ],
  },
  {
    label: "Quản lý nội dung",
    items: [
      { href: "/destinations", label: "Điểm đến", icon: Map },
      { href: "/airports", label: "Sân bay", icon: Plane },
      { href: "/guides", label: "Cẩm nang", icon: BookOpen },
      { href: "/blog", label: "Blog", icon: Newspaper },
      { href: "/reviews", label: "Đánh giá", icon: MessageSquareText },
    ],
  },
  {
    label: "Người dùng",
    items: [{ href: "/users", label: "Users", icon: Users }],
  },
  {
    label: "Đối tác",
    items: [
      { href: "/providers", label: "Duyệt đối tác", icon: ShieldCheck },
      { href: "/properties", label: "Duyệt khách sạn", icon: Building2 },
      { href: "/tours", label: "Duyệt tour", icon: Compass },
      { href: "/experiences", label: "Duyệt experience", icon: Ticket },
      { href: "/vehicles", label: "Duyệt xe", icon: Car },
      { href: "/routes", label: "Duyệt tuyến đường", icon: Route },
      { href: "/aircrafts", label: "Duyệt máy bay", icon: Plane },
      { href: "/flights", label: "Duyệt chuyến bay", icon: PlaneTakeoff },
    ],
  },
  {
    label: "Đặt chỗ",
    items: [
      { href: "/bookings", label: "Đặt phòng", icon: CalendarCheck },
      { href: "/tour-bookings", label: "Đặt tour", icon: CalendarCheck },
      { href: "/experience-bookings", label: "Đặt experience", icon: CalendarCheck },
      { href: "/transport-bookings", label: "Đặt xe", icon: CalendarCheck },
      { href: "/flight-bookings", label: "Đặt vé máy bay", icon: CalendarCheck },
    ],
  },
  {
    label: "Tài chính",
    items: [
      { href: "/payments", label: "Thanh toán", icon: CreditCard },
      { href: "/commissions", label: "Hoa hồng", icon: Percent },
      { href: "/coupons", label: "Mã giảm giá", icon: Tag },
      { href: "/promotions", label: "Khuyến mãi", icon: Megaphone },
    ],
  },
];

const HOTEL_PROVIDER_NAV_GROUPS = [
  {
    label: "Đối tác",
    items: [
      { href: "/my-properties", label: "Khách sạn của tôi", icon: Building2 },
      { href: "/my-bookings", label: "Đặt phòng của tôi", icon: CalendarCheck },
    ],
  },
];

const TOUR_PROVIDER_NAV_GROUPS = [
  {
    label: "Đối tác",
    items: [
      { href: "/my-tours", label: "Tour của tôi", icon: Compass },
      { href: "/my-guides", label: "Hướng dẫn viên", icon: UserCog },
      { href: "/my-tour-bookings", label: "Đặt tour của tôi", icon: CalendarCheck },
    ],
  },
];

const GUIDE_NAV_GROUPS = [
  {
    label: "Hướng dẫn viên",
    items: [
      { href: "/guide-schedule", label: "Lịch dẫn tour", icon: Footprints },
      { href: "/guide-profile", label: "Hồ sơ của tôi", icon: UserCircle },
    ],
  },
];

const EXPERIENCE_PROVIDER_NAV_GROUPS = [
  {
    label: "Đối tác",
    items: [
      { href: "/my-experiences", label: "Experience của tôi", icon: Ticket },
      { href: "/my-experience-bookings", label: "Đặt experience của tôi", icon: CalendarCheck },
    ],
  },
];

const TRANSPORT_PROVIDER_NAV_GROUPS = [
  {
    label: "Đối tác",
    items: [
      { href: "/my-vehicles", label: "Xe của tôi", icon: Car },
      { href: "/my-routes", label: "Tuyến đường của tôi", icon: Route },
      { href: "/my-transport-bookings", label: "Đặt xe của tôi", icon: CalendarCheck },
      { href: "/my-drivers", label: "Tài xế", icon: UserCog },
    ],
  },
];

/** V7 vòng 1 — chỉ Owner/Manager mới quản lý được thành viên (Booking/Finance Staff vẫn xem được trang này nếu vào thẳng URL, chỉ không thấy link ở đây). */
const ORGANIZATION_NAV_GROUP = {
  label: "Tổ chức",
  items: [{ href: "/my-organization/members", label: "Thành viên", icon: Users }],
};

const FLIGHT_PROVIDER_NAV_GROUPS = [
  {
    label: "Đối tác",
    items: [
      { href: "/my-aircrafts", label: "Máy bay của tôi", icon: Plane },
      { href: "/my-flights", label: "Chuyến bay của tôi", icon: PlaneTakeoff },
      { href: "/my-flight-bookings", label: "Đặt vé của tôi", icon: CalendarCheck },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const baseNavGroups =
    user?.role === "ADMIN"
      ? ADMIN_NAV_GROUPS
      : user?.providerType === "TOUR"
        ? TOUR_PROVIDER_NAV_GROUPS
        : user?.providerType === "ACTIVITY"
          ? EXPERIENCE_PROVIDER_NAV_GROUPS
          : user?.providerType === "TRANSPORT"
            ? TRANSPORT_PROVIDER_NAV_GROUPS
            : user?.providerType === "FLIGHT"
              ? FLIGHT_PROVIDER_NAV_GROUPS
              : user?.providerId
              ? HOTEL_PROVIDER_NAV_GROUPS
              : user?.guideId
                ? GUIDE_NAV_GROUPS
                : HOTEL_PROVIDER_NAV_GROUPS;
  const navGroups =
    user?.providerId && (user.orgRole === "OWNER" || user.orgRole === "MANAGER")
      ? [...baseNavGroups, ORGANIZATION_NAV_GROUP]
      : baseNavGroups;

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
        {navGroups.map((group) => (
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
