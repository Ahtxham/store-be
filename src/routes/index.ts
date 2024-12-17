import express from "express";

import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { petRoutes } from "./petRoutes";
import { postRoutes } from "./postRoutes";
import { commentRoutes } from "./commentRoutes";
import { likeRoutes } from "./likeRoutes";
import { reportRoutes } from "./reportRoutes";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
routes.use("/api/auth", authRoutes);
routes.use("/api/users", userRoutes);
routes.use("/api/pets", petRoutes);
routes.use("/api/posts", postRoutes);
routes.use("/api/comments", commentRoutes);
routes.use("/api/likes", likeRoutes);
routes.use("/api/reports", reportRoutes);

export { routes };
