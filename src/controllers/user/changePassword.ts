import { Request, Response } from "express";

import { IUser, User } from "@models/userModel";
import { statusCodes } from "@constants/statusCodes";
import { comparePasswords, hashPassword } from "@utils/passwordHelper";

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!req.user) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    const userId = (req.user as IUser)?.id;
    // Find user by ID
    const user = await User.findById(userId);
    if (!user || !user.password) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Check if old password is correct
    const isMatch = await comparePasswords(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: "Incorrect old password" });
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(statusCodes.OK)
      .json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error });
  }
};
