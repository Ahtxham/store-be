import { Request, Response } from "express";

import { statusCodes } from "@constants/statusCodes";
import { IUser, User } from "@models/userModel";
import { hashPassword } from "@utils/passwordHelper";
import { handleFileUpload } from "@utils/fileHelper";
import { generateToken } from "@utils/jwtHelper";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, username, password, dob, gender }: IUser = req.body;

    if (!email || !password)
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: "Please provide all required fields" });

    const hashedPassword = await hashPassword(password);

    let s3_img: string = "";

    if (req.file) {
      s3_img = await handleFileUpload(req.file);
    }

    const user = new User({
      email,
      username: username || email,
      password: hashedPassword,
      dob,
      gender,
      image: s3_img || undefined,
    });
    await user.save();
    const token = generateToken({ id: user._id });

    const data = { ...user.toObject(), token };
    if ("password" in data) {
      delete data.password;
    }
    return res
      .status(statusCodes.CREATED)
      .json({ message: "User registered successfully", data });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(statusCodes.FORBIDDEN).json({
        message: "Duplicate User Error",
        ...error.keyValue,
      });
    }

    return res.status(statusCodes.FORBIDDEN).json({
      message: error.message || "Error while registering",
      error,
    });
  }
};
