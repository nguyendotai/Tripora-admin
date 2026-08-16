"use client";

import { CalendarRange, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useListMyFlightsQuery } from "@/features/flight/api/flight.api";
import type { Flight } from "@/features/flight/types/flight.types";
import { DeleteFlightDialog } from "@/modules/flight-management/components/delete-flight-dialog";
import { FlightFormDialog } from "@/modules/flight-management/components/flight-form-dialog";
import { FlightScheduleDialog } from "@/modules/flight-management/components/flight-schedule-dialog";
import { FlightStatusBadge } from "@/modules/flight-management/components/flight-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

export default function MyFlightsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyFlightsQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Flight | null>(null);
  const [deleting, setDeleting] = useState<Flight | null>(null);
  const [scheduleFlight, setScheduleFlight] = useState<Flight | null>(null);

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "FLIGHT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (flight: Flight) => {
    setEditing(flight);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Chuyến bay của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách chuyến bay</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm chuyến bay
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách chuyến bay. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có chuyến bay nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm chuyến bay&quot; để tạo chuyến đầu tiên — cần có ít nhất 1 máy bay
                đã được duyệt. Chuyến mới sẽ ở trạng thái chờ duyệt trước khi hiển thị công khai.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chuyến bay</TableHead>
                  <TableHead>Tuyến</TableHead>
                  <TableHead>Máy bay</TableHead>
                  <TableHead>Thời gian bay</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {flight.departureAirport?.code} → {flight.arrivalAirport?.code}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {flight.aircraft?.model}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{flight.duration} phút</TableCell>
                    <TableCell>
                      <FlightStatusBadge status={flight.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title="Lịch bay"
                        onClick={() => setScheduleFlight(flight)}
                      >
                        <CalendarRange className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(flight)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(flight)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <FlightFormDialog open={formOpen} onOpenChange={setFormOpen} flight={editing} />
      <DeleteFlightDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        flight={deleting}
      />
      <FlightScheduleDialog
        open={!!scheduleFlight}
        onOpenChange={(open) => !open && setScheduleFlight(null)}
        flight={scheduleFlight}
      />
    </>
  );
}
