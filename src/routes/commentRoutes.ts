import { Router } from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "@controllers/commentController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, (req, res, next) => {
  createComment(req, res).catch(next);
});
router.get("/:postId", authMiddleware, (req, res, next) => {
  getComments(req, res).catch(next);
});
router.put("/:id", authMiddleware, (req, res, next) => {
  updateComment(req, res).catch(next);
});
router.delete("/:id", authMiddleware, (req, res, next) => {
  deleteComment(req, res).catch(next);
});

export { router as commentRoutes };
