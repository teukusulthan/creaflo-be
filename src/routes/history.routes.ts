import { Router } from "express";
import {
  getHistory,
  getSaved,
  toggleSave,
} from "../controllers/history.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/history", getHistory);
router.get("/saved", getSaved);
router.patch("/:id/toggle-save", authenticate, toggleSave);

export default router;
