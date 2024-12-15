import express from "express";

import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { storeRoutes } from "./storeRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { itemRoutes } from "./itemRoutes";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
routes.use("/api/auth", authRoutes);
routes.use("/api/users", userRoutes);
routes.use("/api/stores", storeRoutes);
routes.use("/api/categories", categoryRoutes);
routes.use("/api/items", itemRoutes);

export { routes };
