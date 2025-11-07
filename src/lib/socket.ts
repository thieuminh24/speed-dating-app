// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket?.connected) return socket;

  const token = localStorage.getItem("token");
  socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => console.log("Socket connected"));
  socket.on("disconnect", () => console.log("Socket disconnected"));

  return socket;
};
