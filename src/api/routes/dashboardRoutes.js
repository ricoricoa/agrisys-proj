import { Router } from "express";
import { overview } from "../controllers/dashboardController.js";
import { authenticate, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/", authenticate, allowRoles("staff", "technician", "admin"), overview);
export default router;
