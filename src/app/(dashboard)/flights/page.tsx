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
import { useListFlightsForModerationQuery } from "@/features/flight/api/flight.api";
import type { Flight, FlightStatus } from "@/features/flight/types/flight.types";
import { FlightStatusBadge } from "@/modules/flight-management/components/flight-status-badge";
import { ReviewFlightDialog } from "@/modules/flight-management/components/review-flight-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: FlightStatus | undefined }[] = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Đã từ chối", value: "REJECTED" },
  { label: "Tất cả", value: undefined },
];

export default function FlightsManagementPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<FlightStatus | undefined>("PENDING");
  const { data, isLoading, isError } = useListFlightsForModerationQuery({ status, limit: 50 });
  const [reviewing, setReviewing] = useState<Flight | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getProviderHomePath(user.providerType));
    }
  }, [user, router]);

  return (
    <>
      <Header title="Chuyến bay" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Duyệt chuyến bay</p>
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
              Không tải được danh sách chuyến bay. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Không có chuyến bay nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chuyến bay</TableHead>
                  <TableHead>Đối tác</TableHead>
                  <TableHead>Tuyến</TableHead>
                  <TableHead>Máy bay</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{flight.provider?.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {flight.departureAirport?.code} → {flight.arrivalAirport?.code}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {flight.aircraft?.model}
                    </TableCell>
                    <TableCell>
                      <FlightStatusBadge status={flight.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setReviewing(flight)}
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

      <ReviewFlightDialog
        open={!!reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
        flight={reviewing}
      />
    </>
  );
}
