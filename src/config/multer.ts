import multer from "multer";

const fileUpload = multer({
  storage: multer.memoryStorage(), // buffer in memory, required for S3
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default fileUpload;
