import bcrypt from "bcrypt";
import type { Request, Response } from "express";

import { User } from "../models/User";
import { signAccessToken } from "../utils/jwt";

const SALT_ROUNDS = 12;
const DUMMY_HASH = bcrypt.hashSync("invalid-password", SALT_ROUNDS);

function normalizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  // Simple, safe baseline (avoids catastrophic backtracking).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPassword(input: unknown): string {
  if (typeof input !== "string") return "";
  // Preserve internal spaces; just trim accidental surrounding whitespace.
  return input.trim();
}

export async function register(req: Request, res: Response): Promise<void> {
  const email = normalizeEmail((req.body as { email?: unknown }).email);
  const password = getPassword((req.body as { password?: unknown }).password);

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid email" });
    return;
  }
  if (password.length < 12) {
    res.status(400).json({
      error: "Bad Request",
      message: "Password must be at least 12 characters"
    });
    return;
  }

  const existing = await User.findOne({ email }).select("_id").lean();
  if (existing) {
    res.status(409).json({ error: "Conflict", message: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await User.create({ email, passwordHash, role: "user" });
    const token = signAccessToken({ sub: user._id.toString(), role: user.role });

    res.status(201).json({
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role }
    });
  } catch (err: unknown) {
    // Handle race-condition duplicate key (unique email index).
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: unknown }).code === 11000
    ) {
      res.status(409).json({ error: "Conflict", message: "Email already registered" });
      return;
    }
    throw err;
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const email = normalizeEmail((req.body as { email?: unknown }).email);
  const password = getPassword((req.body as { password?: unknown }).password);

  if (!isValidEmail(email) || password.length === 0) {
    res.status(400).json({ error: "Bad Request", message: "Invalid email or password" });
    return;
  }

  const user = await User.findOne({ email }).exec();
  const passwordHash = user?.passwordHash ?? DUMMY_HASH;
  const ok = await bcrypt.compare(password, passwordHash);

  if (!user || !ok) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    return;
  }

  const token = signAccessToken({ sub: user._id.toString(), role: user.role });
  res.status(200).json({
    token,
    user: { id: user._id.toString(), email: user.email, role: user.role }
  });
}

