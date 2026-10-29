import { Router } from "express";
import multer from "multer";
import { analyzeFarmImage } from "../controllers/visionController.js";
import { authenticate, allowRoles } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith("image/")) });
const router = Router();
router.post("/analyze", authenticate, allowRoles("farmer"), upload.single("photo"), analyzeFarmImage);
export default router;
