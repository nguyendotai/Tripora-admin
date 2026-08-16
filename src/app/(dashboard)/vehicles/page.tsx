"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListVehiclesForModerationQuery } from "@/features/vehicle/api/vehicle.api";
import type { Vehicle, VehicleStatus } from "@/features/vehicle/types/vehicle.types";
import { ReviewVehicleDialog } from "@/modules/vehicle-management/components/review-vehicle-dialog";
import { VehicleStatusBadge } from "@/modules/vehicle-management/components/vehicle-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: VehicleStatus | undefined }[] = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Đã từ chối", value: "REJECTED" },
  { label: "Tất cả", value: undefined },
];

const TYPE_LABELS: Record<string, string> = {
  CAR: "Xe 4 chỗ",
  SUV: "SUV",
  VAN: "Xe 7-16 chỗ",
  BUS: "Xe khách/Bus",
  MOTORBIKE: "Xe máy",
};

export default function VehiclesManagementPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<VehicleStatus | undefined>("PENDING");
  const { data, isLoading, isError } = useListVehiclesForModerationQuery({ status, limit: 50 });
  const [reviewing, setReviewing] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getProviderHomePath(user.providerType));
    }
  }, [user, router]);

  return (
    <>
      <Header title="Xe" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Duyệt xe</p>
            <div className="flex gap-1.5">
              {FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setStatus(filter.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    status === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách xe. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Không có xe nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên xe</TableHead>
                  <TableHead>Đối tác</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.provider?.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {TYPE_LABELS[vehicle.type] ?? vehicle.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.licensePlate}</TableCell>
                    <TableCell>
                      <VehicleStatusBadge status={vehicle.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setReviewing(vehicle)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <ReviewVehicleDialog
        open={!!reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
        vehicle={reviewing}
      />
    </>
  );
}
