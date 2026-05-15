import multer from "multer";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimetypeOk = ALLOWED_MIME_TYPES.has(file.mimetype);
  const lowerName = String(file.originalname || "").toLowerCase();
  const extension = lowerName.lastIndexOf(".") >= 0 ? lowerName.slice(lowerName.lastIndexOf(".")) : "";
  const extensionOk = ALLOWED_EXTENSIONS.has(extension);

  if (!mimetypeOk || !extensionOk) {
    return cb(new Error("Invalid file type. Only jpg, jpeg, png, webp are allowed."));
  }

  cb(null, true);
};

const multerInstance = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

export const uploadSingleApplicationFile = (fieldName = "file") => (req, res, next) => {
  const handler = multerInstance.single(fieldName);
  handler(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Max size is 5MB.",
          code: "FILE_TOO_LARGE",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || "Upload failed",
        code: "UPLOAD_ERROR",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Invalid upload",
      code: "INVALID_UPLOAD",
    });
  });
};
