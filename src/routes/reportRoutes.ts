import { Router } from "express";
import { reportPost } from "@controllers/reportController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, (req, res, next) => {
  reportPost(req, res).catch(next);
});

export { router as reportRoutes };
