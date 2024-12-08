import { Request, Response } from "express";
import { authService } from "@services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req, res);
    res.status(201).json({ message: "User registered successfully", user });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    // res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req, res);
    res.status(200).json({ message: "Login successful", result });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    // res.status(401).json({ message: error.message });
  }
};
