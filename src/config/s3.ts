import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "your-region" });

export const uploadFile = async (bucketName: string, key: string, body: any) => {
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key, Body: body });
  await s3Client.send(command);
};

export const getFile = async (bucketName: string, key: string) => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const response = await s3Client.send(command);
  return response.Body;
};

export const getSignedUrlForFile = async (bucketName: string, key: string) => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
};
