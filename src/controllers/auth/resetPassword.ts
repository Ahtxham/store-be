import { Request, Response } from "express";
import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { hashPassword } from "@utils/passwordHelper";

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    if (
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires.getTime() < Date.now()
    ) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res
      .status(statusCodes.OK)
      .json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error resetting password", error });
  }
};
