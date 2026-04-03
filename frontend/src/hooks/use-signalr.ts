"use client";

import { useEffect, useRef } from "react";
import {
  startConnection,
  stopConnection,
  joinProject,
  leaveProject,
  getConnection,
} from "@/lib/signalr";

interface NotificationMessage {
  type: string;
  data: unknown;
  projectId: string;
  timestamp: string;
}

interface UseSignalROptions {
  projectId: string;
  onTaskCreated?: (data: unknown) => void;
  onTaskStatusChanged?: (data: unknown) => void;
  onTaskDeleted?: (data: unknown) => void;
  onCommentAdded?: (data: unknown) => void;
}

export function useSignalR({
  projectId,
  onTaskCreated,
  onTaskStatusChanged,
  onTaskDeleted,
  onCommentAdded,
}: UseSignalROptions) {
  const callbacksRef = useRef({
    onTaskCreated,
    onTaskStatusChanged,
    onTaskDeleted,
    onCommentAdded,
  });

  // Keep callbacks ref up-to-date
  callbacksRef.current = {
    onTaskCreated,
    onTaskStatusChanged,
    onTaskDeleted,
    onCommentAdded,
  };

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      await startConnection();
      if (!mounted) return;

      await joinProject(projectId);

      const conn = getConnection();
      if (!conn) return;

      conn.on("ReceiveNotification", (message: NotificationMessage) => {
        if (!mounted) return;

        switch (message.type) {
          case "TaskCreated":
            callbacksRef.current.onTaskCreated?.(message.data);
            break;
          case "TaskStatusChanged":
            callbacksRef.current.onTaskStatusChanged?.(message.data);
            break;
          case "TaskDeleted":
            callbacksRef.current.onTaskDeleted?.(message.data);
            break;
          case "CommentAdded":
            callbacksRef.current.onCommentAdded?.(message.data);
            break;
        }
      });
    };

    setup();

    return () => {
      mounted = false;
      leaveProject(projectId);
      const conn = getConnection();
      conn?.off("ReceiveNotification");
      stopConnection();
    };
  }, [projectId]);
}
