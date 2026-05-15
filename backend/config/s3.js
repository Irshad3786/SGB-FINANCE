import { S3Client } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET_NAME;

if (!REGION) {
  throw new Error("AWS_REGION is required");
}

if (!BUCKET) {
  throw new Error("AWS_S3_BUCKET (or AWS_BUCKET_NAME) is required");
}

const hasStaticCredentials =
  Boolean(process.env.AWS_ACCESS_KEY_ID) && Boolean(process.env.AWS_SECRET_ACCESS_KEY);

export const S3_BUCKET = BUCKET;
export const AWS_REGION = REGION;

export const s3Client = new S3Client({
  region: REGION,
  credentials: hasStaticCredentials
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});
