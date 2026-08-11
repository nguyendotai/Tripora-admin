import Image from "next/image";
import Link from "next/link";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 ${className ?? ""}`}
    >
      <Image
        src="/logo-icon.png"
        alt="Tripora"
        width={32}
        height={32}
        priority
        className="h-8 w-8 object-contain"
      />
      <span
        className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        Tripora{" "}
        <span
          className={`font-normal ${light ? "text-sidebar-foreground" : "text-muted-foreground"}`}
        >
          Admin
        </span>
      </span>
    </Link>
  );
}
