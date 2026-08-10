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
import { type Partner, useListPendingPartnersQuery } from '@/features/partner';
import { VerifyPartnerDialog } from '@/modules/partner-verification/components/verify-partner-dialog';
import { RejectPartnerDialog } from '@/modules/partner-verification/components/reject-partner-dialog';

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  HOTEL: 'Khách sạn',
  TOUR: 'Tour',
  RESTAURANT: 'Nhà hàng',
  VEHICLE: 'Vận chuyển',
};

export default function PartnersPage() {
  const { data: partners, isLoading, isError } = useListPendingPartnersQuery();

  const [verifyingPartner, setVerifyingPartner] = useState<Partner | null>(null);
  const [rejectingPartner, setRejectingPartner] = useState<Partner | null>(null);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-bold">Hồ sơ Partner chờ duyệt</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên doanh nghiệp</TableHead>
                <TableHead>Loại hình</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
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
                    Không thể tải danh sách hồ sơ Partner.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && partners?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Không có hồ sơ nào đang chờ duyệt.
                  </TableCell>
                </TableRow>
              )}

              {partners?.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.businessName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {BUSINESS_TYPE_LABELS[partner.businessType] ?? partner.businessType}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {partner.contactEmail ?? partner.contactPhone ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(partner.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Duyệt"
                        onClick={() => setVerifyingPartner(partner)}
                      >
                        <Check className="size-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Từ chối"
                        onClick={() => setRejectingPartner(partner)}
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

      <VerifyPartnerDialog
        open={Boolean(verifyingPartner)}
        onOpenChange={(open) => !open && setVerifyingPartner(null)}
        partner={verifyingPartner}
      />
      <RejectPartnerDialog
        open={Boolean(rejectingPartner)}
        onOpenChange={(open) => !open && setRejectingPartner(null)}
        partner={rejectingPartner}
      />
    </>
  );
}
