import { Router } from "express";
import { authController } from "@controllers/auth";
import { generalHelper } from "@services/generalHelper";

const router = Router();
router.post("/register", generalHelper.upload.single('file'), authController.register);
router.post("/login", authController.login);

export { router as authRoutes };
