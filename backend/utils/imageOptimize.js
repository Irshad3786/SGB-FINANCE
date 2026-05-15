import sharp from "sharp";

export const optimizeToWebp = async (inputBuffer) => {
  if (!inputBuffer || !(inputBuffer instanceof Buffer) || inputBuffer.length === 0) {
    throw new Error("Invalid image buffer");
  }

  return sharp(inputBuffer)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
};
