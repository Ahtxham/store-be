import { request, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { JWT_SECRET, SERVER_URL, AWS } from "@constants/env";
import { uploadFileToAws } from "@config/s3";

const saltRounds = 10;

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, username, password, dob, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let s3_img: string = "";

    if (req.file) {
      const { filename, path } = req.file;
      if (AWS.ACCESSKEYID === "") {
        s3_img = `${SERVER_URL}/${path}`;
      } else {
        try {
          let keyName = `users/profile/${filename}`;
          s3_img = await uploadFileToAws(keyName, path);
        } catch (error) {
          console.error("Error during S3 upload:", error);
          throw new Error("Image upload failed");
        }
      }
    }

    const newUser = new User({
      email,
      username: username || email,
      password: hashedPassword,
      dob,
      gender,
      image: s3_img || null,
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
      expiresIn: "24h",
    });
    const data = { ...user.toObject(), token };
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
      message: "Error while registering",
      error: JSON.stringify(error),
    });
  }
};
