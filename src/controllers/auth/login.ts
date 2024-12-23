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
    if (!user || !user.password) {
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

    let userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    return res.status(statusCodes.OK).json({ token, ...userObj, });
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: "Error logging in", error });
  }
};
