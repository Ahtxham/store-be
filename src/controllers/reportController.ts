import { Request, Response } from "express";
import { Report } from "@models/reportModel";
import { statusCodes } from "@constants/statusCodes";

export const reportPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { reason, post } = req.body;
    const owner = (req.user as any)?.id;
    const report = new Report({ reason, post, owner });
    await report.save();
    return res.status(statusCodes.CREATED).json(report);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error reporting post", error });
  }
};
