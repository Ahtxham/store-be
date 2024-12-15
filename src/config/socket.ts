import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { LOGUI } from "@constants/logs";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(LOGUI.FgGreen, "A user connected");
    socket.on("disconnect", () => {
      console.log(LOGUI.FgRed, "User disconnected");
    });

    // Add your socket event handlers here
  });

  return io;
};
