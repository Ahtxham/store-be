import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@controllers/categoryController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();
router.delete("/", authMiddleware, (req, res, next) => {
  createCategory(req, res).catch(next);
});
router.get("/", authMiddleware, (req, res, next) => {
  getCategories(req, res).catch(next);
});
router.get("/:id", authMiddleware, (req, res, next) => {
  getCategoryById(req, res).catch(next);
});
router.put("/:id", authMiddleware, (req, res, next) => {
  updateCategory(req, res).catch(next);
});
router.delete("/:id", authMiddleware, (req, res, next) => {
  deleteCategory(req, res).catch(next);
});

export { router as categoryRoutes };
