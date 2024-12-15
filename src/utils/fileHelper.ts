import { uploadFileToAws } from "@config/s3";
import { AWS, SERVER_URL } from "@constants/env";

interface File {
  filename: string;
  path: string;
}

export const handleFileUpload = async (file: File): Promise<string> => {
  let s3_img: string = "";
  if (file) {
    const { filename, path } = file;
    if (!AWS.ACCESSKEYID) {
      s3_img = `${SERVER_URL}/${path}`;
    } else {
      try {
        const keyName = `${path}/${filename}`;
        s3_img = await uploadFileToAws(keyName, path);
      } catch (error) {
        console.error("Error during S3 upload:", error);
        throw new Error("Image upload failed");
      }
    }
  }
  return s3_img;
};