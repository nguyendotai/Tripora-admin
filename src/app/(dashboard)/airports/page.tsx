"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { useListAirportsQuery } from "@/features/airport/api/airport.api";
import type { Airport } from "@/features/airport/types/airport.types";
import { AirportFormDialog } from "@/modules/airport-management/components/airport-form-dialog";
import { DeleteAirportDialog } from "@/modules/airport-management/components/delete-airport-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

export default function AirportsManagementPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListAirportsQuery({ limit: 100 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Airport | null>(null);
  const [deleting, setDeleting] = useState<Airport | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getProviderHomePath(user.providerType));
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (airport: Airport) => {
    setEditing(airport);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Sân bay" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách sân bay</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm sân bay
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách sân bay. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có sân bay nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm sân bay&quot; để tạo dữ liệu tham chiếu cho Flight — Airline chọn
                sân bay đi/đến từ danh sách này khi tạo chuyến bay.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã IATA</TableHead>
                  <TableHead>Tên sân bay</TableHead>
                  <TableHead>Thành phố</TableHead>
                  <TableHead>Quốc gia</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((airport) => (
                  <TableRow key={airport.id}>
                    <TableCell className="font-medium">{airport.code}</TableCell>
                    <TableCell>{airport.name}</TableCell>
                    <TableCell className="text-muted-foreground">{airport.city}</TableCell>
                    <TableCell className="text-muted-foreground">{airport.country}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(airport)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(airport)}
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

      <AirportFormDialog open={formOpen} onOpenChange={setFormOpen} airport={editing} />
      <DeleteAirportDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        airport={deleting}
      />
    </>
  );
}
