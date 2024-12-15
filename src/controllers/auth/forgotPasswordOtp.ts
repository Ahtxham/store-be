import { Request, Response } from "express";
import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { sendEmail } from "@utils/emailHelper";
import otpService from "@services/otpService";
import { AUTH_CONFIG } from "@config/constants";

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
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + AUTH_CONFIG.OTP_EXPIRES_IN);
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
