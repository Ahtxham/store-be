import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { LOGUI } from "@constants/logs";

export const setupSocket = (server: HttpServer | HttpsServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
    },
    path: "/ws",
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log(LOGUI.FgGreen, "A user connected");
    socket.on("disconnect", () => {
      console.log(LOGUI.FgRed, "User disconnected");
    });
    socket.on("error", (err) => {
      console.error(LOGUI.FgRed, "Socket error:", err);
    });
    // Add your socket event handlers here
  });

  return io;
};
