import { Router } from "express";
import { userController } from "../controllers/user";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, userController.getUser);
router.put("/profile", authMiddleware, userController.updateUser);

export { router as userRoutes };
