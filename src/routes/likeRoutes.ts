import { Router } from "express";
import { likePost, unlikePost, getLikes } from "@controllers/likeController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();

router.post("/:postId/like", authMiddleware, (req, res, next) => {
  likePost(req, res).catch(next);
});
router.post("/:postId/unlike", authMiddleware, (req, res, next) => {
  unlikePost(req, res).catch(next);
});
router.get("/:postId/likes", authMiddleware, (req, res, next) => {
  getLikes(req, res).catch(next);
});

export { router as likeRoutes };
