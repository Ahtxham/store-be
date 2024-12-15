import { Router } from "express";
import {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
} from "@controllers/storeController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();
router.post("/", authMiddleware, (req, res, next) => {
  createStore(req, res).catch(next);
});
router.get("/", authMiddleware, (req, res, next) => {
  getStores(req, res).catch(next);
});
router.get("/:id", authMiddleware, (req, res, next) => {
  getStoreById(req, res).catch(next);
});
router.put("/:id", authMiddleware, (req, res, next) => {
  updateStore(req, res).catch(next);
});
router.delete("/:id", authMiddleware, (req, res, next) => {
  deleteStore(req, res).catch(next);
});

export { router as storeRoutes };
