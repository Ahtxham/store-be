import { Request, Response } from "express";
import { User } from "@models/userModel";
import { statusCodes } from "@constants/statusCodes";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Access denied. Invalid Token" });
    }
    const { gender, dob } = req.body;
    // fields to update
    const updateData = { gender, dob };
    let updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    updatedUser = updatedUser.toObject();
    delete updatedUser.password;
    delete updatedUser.__v;
    delete updatedUser._id;
    res.status(statusCodes.ACCEPTED).json(updatedUser);
  } catch (error) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error });
  }
};
