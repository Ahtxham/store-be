import { Request, Response } from "express";
import { IUser } from "@models/userModel";
import { statusCodes } from "@constants/statusCodes";
import userService from "@services/userService";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)?.id;
    const { gender, dob } = req.body;
    // fields to update add more if needed
    const updateData = { gender, dob };
    let updatedUser = await userService.updateUser(userId, updateData);
    if (!updatedUser) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res.status(statusCodes.ACCEPTED).json(updatedUser);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error });
  }
};
