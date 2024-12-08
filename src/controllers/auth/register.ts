import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { statusCodes } from "@constants/statusCodes";
import { User } from "@models/userModel";
import { JWT_SECRET } from "@constants/env";

const saltRounds = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, dob, gender, image } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      username: username || email,
      password: hashedPassword,
      dob,
      gender,
      image,
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
