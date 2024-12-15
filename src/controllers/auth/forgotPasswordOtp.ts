import { Request, Response } from "express";
import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { sendEmail } from "@config/sendgrid";
import otpService from "@services/otpService";

export const forgotPasswordOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const otp = otpService.generateOtp();
    user.otp = otp; // Assuming you have an `otp` field in your user model
    user.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();

    await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);

    return res
      .status(statusCodes.OK)
      .json({ message: "OTP sent to your email" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error sending OTP", error });
  }
};