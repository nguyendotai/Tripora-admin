import type { Metadata } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const googleSans = Google_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const googleSansCode = Google_Sans_Code({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Tripora Admin",
  description: "Tripora Admin - Partner/Admin dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${googleSans.variable} ${googleSansCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
