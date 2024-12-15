import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";
import { LOGUI } from "@constants/logs";

const createStorage = (destinationPath: string): StorageEngine => {
  return multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, destinationPath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

const uploadHelper = (destinationPath: string) => {
  if (!destinationPath) {
    throw new Error("Destination path is required");
  }
  if (!fs.existsSync(destinationPath)) {
    console.log(
      LOGUI.FgYellow,
      `${destinationPath} path does not exist. Creating one...`
    );
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  return multer({ storage: createStorage(destinationPath) });
};

export { uploadHelper };
