import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});

const imageOnly = (_req, file, callback) => file.mimetype.startsWith("image/")
  ? callback(null, true)
  : callback(new Error("Only image files are accepted."));

export const uploadReportPhotos = multer({ storage, fileFilter: imageOnly, limits: { fileSize: 8 * 1024 * 1024 } }).array("photos", 5);
export const uploadOwnershipProof = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } }).single("ownershipProof");
export const uploadRegistrationDocuments = multer({ storage, fileFilter: imageOnly, limits: { fileSize: 8 * 1024 * 1024 } }).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "ownershipProof", maxCount: 1 },
]);
