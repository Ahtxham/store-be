import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("\x1b[33m%s\x1b[0m", "A user connected");
    socket.on("disconnect", () => {
      console.log("\x1b[33m%s\x1b[0m", "User disconnected");
    });

    // Add your socket event handlers here
  });

  return io;
};
