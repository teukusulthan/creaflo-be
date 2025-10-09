import { Router } from "express";
import { getHistory, toggleSave } from "../controllers/history.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/history", getHistory);
router.patch("/:id/toggle-save", authenticate, toggleSave);

export default router;
