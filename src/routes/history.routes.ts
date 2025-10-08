import { Router } from "express";
import { getHistory } from "../controllers/history.controller";

const router = Router();

router.get("/history", getHistory);

export default router;
