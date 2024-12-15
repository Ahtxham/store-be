import { Router } from "express";
import { uploadHelper } from "@utils/uploadHelper";

import {
  register,
  login,
  forgotPasswordLink,
  forgotPasswordOtp,
  validateOtp,
  resetPassword,
} from "@controllers/auth";

const fileHelper = uploadHelper("./uploads/profiles").single("profile");
const router = Router();

router.post("/register", fileHelper, (req, res, next) => {
  register(req, res).catch(next);
});
router.post("/login", (req, res, next) => {
  login(req, res).catch(next);
});
router.post("/forgot-password-link", (req, res, next) => {
  forgotPasswordLink(req, res).catch(next);
});
router.post("/forgot-password-otp", (req, res, next) => {
  forgotPasswordOtp(req, res).catch(next);
});
router.post("/validate-otp", (req, res, next) => {
  validateOtp(req, res).catch(next);
});
router.post("/reset-password", (req, res, next) => {
  resetPassword(req, res).catch(next);
});

export { router as authRoutes };
