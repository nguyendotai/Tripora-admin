"use client";

import { useEffect } from "react";
import { loadSession } from "@/features/auth/services/auth-storage";
import { setCredentials } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";

export function SessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const session = loadSession();
    if (session) {
      dispatch(setCredentials(session));
    }
  }, [dispatch]);

  return null;
}
