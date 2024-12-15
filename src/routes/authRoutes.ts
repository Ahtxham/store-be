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
router.post("/forgot-password-link", (req, res, next) => {
  authController.forgotPasswordLink(req, res).catch(next);
});

// router.post("/forgot-password-otp", forgotPasswordOtp);
// router.post("/validate-otp", validateOtp);
// router.post("/reset-password", resetPassword);

export { router as authRoutes };
