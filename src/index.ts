import { server } from "./server";
import { connectDB } from "@config/db";
import { setupSocket } from "@config/socket";
import { PORT } from "@constants/env";

// Database setup
connectDB();

// Server setup
const port: number = parseInt(PORT as string, 10) || 4000;
server.listen(port, () => {
  console.log("\x1b[35m%s\x1b[0m", `Serving on port ${port}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  console.error("\x1b[31m%s\x1b[0m", error);
});

// Socket setup
setupSocket(server);
