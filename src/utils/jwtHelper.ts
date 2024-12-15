import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface UserPayload {
  id: string;
}

export const generateToken = (
  user: UserPayload,
  expiresIn: string = "24h"
): string => {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn,
  });
};
