import { Request, Response } from "express";

import { statusCodes } from "@constants/statusCodes";

import { sendEmail } from "@utils/emailHelper";
import { generateToken } from "@utils/jwtHelper";
import userService from "@services/userService";

export const forgotPasswordLink = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, callback } = req.body;

  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const token = generateToken({ id: user._id }, "1h");

    const resetLink = `${callback}?token=${token}`;

    // Send email with the reset link
    await sendEmail(
      user.email,
      "Password Reset",
      `Click here to reset your password: ${resetLink}`
    );
    return res.status(statusCodes.OK).json({
      message:
        "Password reset link sent to your email that will expire in 1 hour",
    });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error sending password reset link", error });
  }
};
