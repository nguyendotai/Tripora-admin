"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionHydrator } from "@/shared/components/session-hydrator";
import { store } from "@/store/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionHydrator />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
