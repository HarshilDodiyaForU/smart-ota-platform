import { Router } from "express";
import rateLimit from "express-rate-limit";

import { login, register } from "../controllers/authController";

export const authRouter = Router();

// Stricter limiter for credential endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);

