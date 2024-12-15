import { Request, Response } from "express";
import { statusCodes } from "@constants/statusCodes";
import userService from "@services/userService";

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req.user as any)?.id;
    let user = await userService.getUserById(userId);
    if (!user) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res.status(statusCodes.ACCEPTED).json(user);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong!", error });
  }
};
