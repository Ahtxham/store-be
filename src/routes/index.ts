import express from "express";
import { json } from "body-parser";

import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";

const routes = express.Router();

// Middleware
routes.use(json());

// Routes
routes.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
routes.use("/api/auth", authRoutes);
routes.use("/api/users", userRoutes);

export { routes };
