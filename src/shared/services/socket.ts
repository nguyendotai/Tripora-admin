"use client";

import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/configs/env";
import { notificationApi } from "@/features/notification/api/notification.api";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

// Socket.IO gan o goc HTTP server, khong theo prefix REST "/api/v1".
const SOCKET_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

let socket: Socket | null = null;

/** V9 vong 1 — nghe push realtime cho Notification qua Socket.IO. Dung song song voi polling
 * 60s da co san trong notification-bell.tsx (khong xoa) lam lop du phong khi socket bi rot —
 * nhan duoc event thi chi invalidate tag de RTK Query tu refetch, khong tu dung lai cache. */
export function useNotificationSocket() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) {
      socket?.disconnect();
      socket = null;
      return;
    }

    socket = io(SOCKET_URL, { auth: { token: accessToken } });
    socket.on("notification:new", () => {
      dispatch(notificationApi.util.invalidateTags([{ type: "Notification", id: "LIST" }]));
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [accessToken, dispatch]);
}
