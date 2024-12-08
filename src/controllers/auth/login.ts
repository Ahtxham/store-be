import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { JWT_SECRET } from "@constants/env";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { message: "Invalid credentials" };
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
      expiresIn: "24h",
    });
    const data = { token, user: user.toObject() };
    delete data.user.password;
    delete data.user.__v;
    delete data.user._id;

    res.status(statusCodes.OK).json(data);
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: "Error logging in", error });
  }
};
