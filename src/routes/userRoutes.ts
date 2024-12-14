import { Router } from "express";
import { userController } from "../controllers/user";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadHelper } from "@utils/uploadHelper";

const fileHelper = uploadHelper("./uploads/profiles").single("profile");

const router = Router();

router.get("/profile", authMiddleware, (req, res, next) => {
  userController.getUser(req, res).catch(next);
});
router.put("/profile", authMiddleware, fileHelper, (req, res, next) => {
  userController.updateUser(req, res).catch(next);
});
export { router as userRoutes };
