import { Router } from "express";
import { uploadHelper } from "@utils/uploadHelper";
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from "@controllers/petController";
import { authMiddleware } from "@middlewares/authMiddleware";

const fileHelper = uploadHelper("./uploads/profiles").single("profile");
const router = Router();

router.get("/", fileHelper, authMiddleware, (req, res, next) => {
  getPets(req, res).catch(next);
});
router.get("/:id", authMiddleware, (req, res, next) => {
  getPetById(req, res).catch(next);
});
router.post("/", authMiddleware, (req, res, next) => {
  createPet(req, res).catch(next);
});
router.put("/:id", authMiddleware, (req, res, next) => {
  updatePet(req, res).catch(next);
});
router.delete("/:id", authMiddleware, (req, res, next) => {
  deletePet(req, res).catch(next);
});

export { router as petRoutes };
