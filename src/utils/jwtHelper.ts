import { AUTH_CONFIG } from "@config/constants";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface UserPayload {
  id: string;
}

export const generateToken = (
  user: UserPayload,
  expiresIn: string = AUTH_CONFIG.JWT_EXPIRES_IN
): string => {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn,
  });
};
