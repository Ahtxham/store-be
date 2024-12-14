import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@constants/env";
import { statusCodes } from "@constants/statusCodes";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(statusCodes.BAD_REQUEST).json({ message: "Invalid token." });
  }
};
