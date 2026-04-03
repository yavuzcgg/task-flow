import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function getConnection(): signalR.HubConnection | null {
  return connection;
}

export function createConnection(): signalR.HubConnection {
  if (connection) return connection;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/tasks`, {
      accessTokenFactory: () => localStorage.getItem("token") || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  return connection;
}

export async function startConnection(): Promise<void> {
  const conn = createConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    try {
      await conn.start();
    } catch (err) {
      console.error("SignalR connection failed:", err);
    }
  }
}

export async function stopConnection(): Promise<void> {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
  connection = null;
}

export async function joinProject(projectId: string): Promise<void> {
  const conn = getConnection();
  if (conn?.state === signalR.HubConnectionState.Connected) {
    await conn.invoke("JoinProject", projectId);
  }
}

export async function leaveProject(projectId: string): Promise<void> {
  const conn = getConnection();
  if (conn?.state === signalR.HubConnectionState.Connected) {
    await conn.invoke("LeaveProject", projectId);
  }
}
