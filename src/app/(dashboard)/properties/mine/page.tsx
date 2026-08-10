'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { type Property, useListMyPropertiesQuery } from '@/features/property';
import { PropertyFormDialog } from '@/modules/property-management/components/property-form-dialog';
import { DeletePropertyDialog } from '@/modules/property-management/components/delete-property-dialog';

const STATUS_LABELS: Record<string, string> = {
  PENDING_APPROVAL: 'Chờ duyệt',
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Bị từ chối/ẩn',
};

const STATUS_STYLES: Record<string, string> = {
  PENDING_APPROVAL: 'bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]',
  ACTIVE: 'bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]',
  INACTIVE: 'bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]',
};

export default function MyPropertiesPage() {
  const { data: properties, isLoading, isError } = useListMyPropertiesQuery();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  const openCreateForm = () => {
    setEditingProperty(null);
    setFormOpen(true);
  };

  const openEditForm = (property: Property) => {
    setEditingProperty(property);
    setFormOpen(true);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-bold">Property của tôi</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-end">
          <Button onClick={openCreateForm}>
            <Plus className="size-4" />
            Thêm Property
          </Button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Thành phố</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
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
                    Không thể tải danh sách Property. Tài khoản này có thể chưa có hồ sơ Partner.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && properties?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Bạn chưa có Property nào.
                  </TableCell>
                </TableRow>
              )}

              {properties?.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell className="text-muted-foreground">{property.type}</TableCell>
                  <TableCell className="text-muted-foreground">{property.city ?? '—'}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[property.status]}`}>
                      {STATUS_LABELS[property.status]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Sửa"
                        onClick={() => openEditForm(property)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Xoá"
                        onClick={() => setDeletingProperty(property)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <PropertyFormDialog open={formOpen} onOpenChange={setFormOpen} property={editingProperty} />
      <DeletePropertyDialog
        open={Boolean(deletingProperty)}
        onOpenChange={(open) => !open && setDeletingProperty(null)}
        property={deletingProperty}
      />
    </>
  );
}
