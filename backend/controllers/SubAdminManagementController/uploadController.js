import { v4 as uuidv4 } from "uuid";
import { optimizeToWebp } from "../../utils/imageOptimize.js";
import {
  buildApplicationObjectKey,
  isValidApplicationObjectKey,
  normalizeVehicleNumber,
} from "../../utils/s3Keys.js";
import { createSignedGetUrl, uploadWebpBufferToS3 } from "../../utils/s3Upload.js";

export const uploadApplicationDocument = async (req, res) => {
  try {
    const { vehicleNumber, personType, documentName } = req.body || {};

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "file is required (multipart/form-data field 'file')",
        code: "FILE_REQUIRED",
      });
    }

    const uploadId = uuidv4();
    const normalizedVehicleNumber = normalizeVehicleNumber(vehicleNumber);

    const key = buildApplicationObjectKey({
      vehicleNumber: normalizedVehicleNumber,
      personType,
      documentName,
      timestamp: Date.now(),
    });

    const optimizedBuffer = await optimizeToWebp(req.file.buffer);

    await uploadWebpBufferToS3({ key, buffer: optimizedBuffer });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        uploadId,
        key,
        vehicleNumber: normalizedVehicleNumber,
        personType: String(personType || "").toLowerCase(),
        documentName: String(documentName || "").toLowerCase(),
      },
    });
  } catch (error) {
    const message = error?.message || "Failed to upload document";
    const isValidationError =
      message.startsWith("Invalid ") ||
      message.toLowerCase().includes("required") ||
      message.toLowerCase().includes("unsupported");

    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message,
      code: isValidationError ? "VALIDATION_ERROR" : "UPLOAD_FAILED",
    });
  }
};

export const getSignedUrlForKey = async (req, res) => {
  try {
    const key = String(req.query?.key || "").trim();

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "key query param is required",
        code: "KEY_REQUIRED",
      });
    }

    if (!isValidApplicationObjectKey(key)) {
      return res.status(400).json({
        success: false,
        message: "Invalid key format",
        code: "INVALID_KEY",
      });
    }

    const { url, expiresInSeconds } = await createSignedGetUrl({
      key,
      expiresInSeconds: 300,
    });

    return res.status(200).json({
      success: true,
      message: "Signed URL generated",
      data: {
        key,
        url,
        expiresInSeconds,
      },
    });
  } catch (error) {
    const message = error?.message || "Failed to generate signed URL";
    const isValidationError =
      message.startsWith("Invalid ") ||
      message.toLowerCase().includes("required");

    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message,
      code: isValidationError ? "VALIDATION_ERROR" : "SIGNED_URL_FAILED",
    });
  }
};
