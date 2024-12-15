import { Request, Response } from "express";
import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";

export const validateOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Invalid or expired OTP" });
    }

    return res.status(statusCodes.OK).json({ message: "OTP is valid" });
  } catch (error: Error | any) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};
