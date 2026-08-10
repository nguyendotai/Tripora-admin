'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { type Property, useListPendingPropertiesQuery } from '@/features/property';
import { ApprovePropertyDialog } from '@/modules/property-approval/components/approve-property-dialog';
import { RejectPropertyDialog } from '@/modules/property-approval/components/reject-property-dialog';

export default function PropertiesPage() {
  const { data, isLoading, isError } = useListPendingPropertiesQuery();

  const [approvingProperty, setApprovingProperty] = useState<Property | null>(null);
  const [rejectingProperty, setRejectingProperty] = useState<Property | null>(null);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-bold">Properties chờ duyệt</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Thành phố</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Đang tải...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-destructive">
                    Không thể tải danh sách Property. Kiểm tra lại Backend.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Không có Property nào đang chờ duyệt.
                  </TableCell>
                </TableRow>
              )}

              {data?.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell className="text-muted-foreground">{property.type}</TableCell>
                  <TableCell className="text-muted-foreground">{property.city ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(property.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Duyệt"
                        onClick={() => setApprovingProperty(property)}
                      >
                        <Check className="size-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Từ chối"
                        onClick={() => setRejectingProperty(property)}
                      >
                        <X className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <ApprovePropertyDialog
        open={Boolean(approvingProperty)}
        onOpenChange={(open) => !open && setApprovingProperty(null)}
        property={approvingProperty}
      />
      <RejectPropertyDialog
        open={Boolean(rejectingProperty)}
        onOpenChange={(open) => !open && setRejectingProperty(null)}
        property={rejectingProperty}
      />
    </>
  );
}
