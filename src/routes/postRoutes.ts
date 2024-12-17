import { Router } from "express";
import { uploadHelper } from "@utils/uploadHelper";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "@controllers/postController";
import { authMiddleware } from "@middlewares/authMiddleware";

const fileHelper = uploadHelper("./uploads/posts").single("media");
const router = Router();

router.get("/", authMiddleware, (req, res, next) => {
  getPosts(req, res).catch(next);
});
router.get("/:id", authMiddleware, (req, res, next) => {
  getPostById(req, res).catch(next);
});
router.post("/", authMiddleware, fileHelper, (req, res, next) => {
  createPost(req, res).catch(next);
});
router.put("/:id", authMiddleware, fileHelper, (req, res, next) => {
  updatePost(req, res).catch(next);
});
router.delete("/:id", authMiddleware, (req, res, next) => {
  deletePost(req, res).catch(next);
});

export { router as postRoutes };
