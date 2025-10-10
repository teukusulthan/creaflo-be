import { Router } from "express";
import { login, me, register, verify } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify", verify);
router.get("/me", authenticate, me);

export default router;
