import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { AWS } from "@constants/env";
import fs from "fs";
import { HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FILE_CONFIG } from "./constants";
import { LOGUI } from "@constants/logs";

export const s3Client = new S3Client({
  region: AWS.REGION,
  credentials: {
    accessKeyId: AWS.ACCESSKEYID,
    secretAccessKey: AWS.SECRETACCESSKEY,
  },
});

// Export folder names for easier reference

export const uploadFileToAws = async (
  fileName: string,
  filePath: string
): Promise<string> => {
  try {
    await s3Client
      .send(
        new PutObjectCommand({
          Bucket: AWS.BUCKET_NAME,
          Key: fileName,
          Body: fs.createReadStream(filePath),
          ACL: "public-read",
          ContentType: FILE_CONFIG.ALLOWED_FILE_TYPES[0],
        })
      )
      .then(() => {
        // Delete the file from the local filesystem after successful upload
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(LOGUI.FgRed, "Error deleting file:", err);
            }
          });
        }
      });

    const publicUrl = `https://${AWS.BUCKET_NAME}.s3.${AWS.REGION}.amazonaws.com/${fileName}`;

    return publicUrl;
  } catch (err) {
    console.error("Error ", err);
    throw new Error(err as string);
  }
};

export const getFileUrlFromAws = async (
  fileName: string,
  expireTime: number | null = null
): Promise<string> => {
  try {
    const check = await isFileAvailableInAwsBucket(fileName);

    if (check) {
      const command = new GetObjectCommand({
        Bucket: AWS.BUCKET_NAME,
        Key: fileName,
      });

      const url = await getSignedUrl(s3Client, command, {
        expiresIn: expireTime ?? undefined,
      });
      return url;
    } else {
      return "error";
    }
  } catch (err) {
    console.log("error ::", err);
    return "error";
  }
};

export const isFileAvailableInAwsBucket = async (
  fileName: string
): Promise<boolean> => {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: AWS.BUCKET_NAME,
        Key: fileName,
      })
    );
    return true;
  } catch (err: any) {
    if (err.name === "NotFound") {
      return false;
    } else {
      return false;
    }
  }
};

export const deleteFileFromAws = async (fileName: string): Promise<string> => {
  try {
    const deleteParams = {
      Bucket: AWS.BUCKET_NAME,
      Key: fileName,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    return "success";
  } catch (err) {
    console.error("Error ", err);
    return "error";
  }
};
