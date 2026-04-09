import jwt from "jsonwebtoken";

import { env } from "../config/env";

export type JwtPayload = {
  sub: string; // userId
  role: "user" | "admin";
};

export function signAccessToken(payload: JwtPayload): string {
  // HS256 using server-side secret. Ensure TLS in production so credentials/tokens aren't exposed.
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d"
  });
}

