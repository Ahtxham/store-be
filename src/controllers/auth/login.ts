import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { JWT_SECRET } from "@constants/env";
import { comparePasswords } from "@utils/passwordHelper";
import { generateToken } from "@utils/jwtHelper";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id });
    const data = { token, user: user.toObject() };
    delete data.user.password;
    delete data.user.__v;
    delete data.user._id;

    return res.status(statusCodes.OK).json(data);
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: "Error logging in", error });
  }
};
