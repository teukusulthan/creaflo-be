import { Router } from "express";
import {
  caption,
  hook,
  ideas,
  hashtags,
  completion,
} from "../controllers/ai.controller";

const router = Router();

router.post("/completions", completion);

router.post("/caption", caption);
router.post("/hook", hook);
router.post("/ideas", ideas);
router.post("/hashtags", hashtags);

export default router;
