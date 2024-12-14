import express from "express";

import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
routes.use("/api/auth", authRoutes);
routes.use("/api/users", userRoutes);

export { routes };
