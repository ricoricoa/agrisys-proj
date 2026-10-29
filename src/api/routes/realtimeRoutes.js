import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { subscribeToRealtimeUpdates } from "../services/realtimeService.js";

const router = Router();
router.get("/events", authenticate, subscribeToRealtimeUpdates);
export default router;
