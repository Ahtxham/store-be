import { Router } from "express";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "@controllers/itemController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();
router.post("/", authMiddleware, (req, res, next) => {
  createItem(req, res).catch(next);
});
router.get("/", authMiddleware, (req, res, next) => {
  getItems(req, res).catch(next);
});
router.get("/:id", authMiddleware, (req, res, next) => {
  getItemById(req, res).catch(next);
});
router.put("/:id", authMiddleware, (req, res, next) => {
  updateItem(req, res).catch(next);
});
router.delete("/:id", authMiddleware, (req, res, next) => {
  deleteItem(req, res).catch(next);
});

export { router as itemRoutes };
