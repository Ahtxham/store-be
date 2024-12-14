import { Router } from "express";
import { authController } from "@controllers/auth";
import { uploadHelper } from "@utils/uploadHelper";

const fileHelper = uploadHelper("./uploads/profiles").single("profile");
const router = Router();

router.post("/register", fileHelper, (req, res, next) => {
  authController.register(req, res).catch(next);
});
router.post("/login", (req, res, next) => {
  authController.login(req, res).catch(next);
});

export { router as authRoutes };
