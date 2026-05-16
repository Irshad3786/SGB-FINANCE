import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_REGION, S3_BUCKET, s3Client } from "../config/s3.js";

export const uploadWebpBufferToS3 = async ({ key, buffer }) => {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey) throw new Error("S3 key is required");
  if (!buffer || !(buffer instanceof Buffer) || buffer.length === 0) {
    throw new Error("Upload buffer is required");
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: normalizedKey,
    Body: buffer,
    ContentType: "image/webp",
    // Default ACL is private; keep bucket private.
  });

  await s3Client.send(command);

  return {
    bucket: S3_BUCKET,
    region: AWS_REGION,
    key: normalizedKey,
  };
};

export const createSignedGetUrl = async ({ key, expiresInSeconds = 300 }) => {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey) throw new Error("S3 key is required");

  const ttl = Number(expiresInSeconds);
  if (!Number.isFinite(ttl) || ttl <= 0) throw new Error("Invalid expiresInSeconds");

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: normalizedKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: ttl });
  return { url, expiresInSeconds: ttl };
};

/**
 * Generates a signed URL for an S3 image key if the key is valid.
 * Returns the signed URL if key exists, otherwise returns empty string.
 * @param {string} key - S3 object key
 * @param {number} expiresInSeconds - URL expiration time (default: 3600 = 1 hour)
 * @returns {Promise<string>} - Signed URL or empty string
 */
export const getSignedImageUrl = async ({ key, expiresInSeconds = 3600 }) => {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey) return "";

  try {
    const { url } = await createSignedGetUrl({ key: normalizedKey, expiresInSeconds });
    return url;
  } catch (error) {
    console.error(`Failed to generate signed URL for S3 key "${normalizedKey}":`, error.message);
    return "";
  }
};
