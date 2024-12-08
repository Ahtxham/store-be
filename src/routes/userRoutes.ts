import { Router } from "express";
import { getUserDetails, updateUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, getUserDetails);
router.put("/profile", authMiddleware, updateUser);

export { router as userRoutes };
