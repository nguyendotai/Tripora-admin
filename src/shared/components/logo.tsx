import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

export function Logo({ textClassName }: { textClassName?: string }) {
  return (
    <span className="flex items-center gap-2">
      <Image src="/logo-icon.png" alt="" width={32} height={32} className="size-8" priority />
      <span className={cn('text-lg font-bold tracking-tight', textClassName)}>
        Tripora <span className="text-primary">Admin</span>
      </span>
    </span>
  );
}
