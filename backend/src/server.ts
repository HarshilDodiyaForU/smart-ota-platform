import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDb } from "./config/db";
import { env } from "./config/env";
import { authRouter } from "./routes/authRoutes";
import { healthRouter } from "./routes/healthRoutes";

/**
 * Baseline security posture (step 1):
 * - `helmet()` sets secure HTTP headers.
 * - CORS is explicitly scoped to the frontend origin.
 * - A generic rate limiter is applied globally (we'll tune per-route later).
 *
 * Zero-knowledge reminder:
 * This backend will NEVER receive plaintext file contents or user encryption keys.
 * Upload endpoints (later steps) will accept only encrypted blobs + metadata.
 */

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // needed for correct IPs behind reverse proxies (rate limiting, logs)

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

// JSON parsing is fine for auth/metadata; file uploads will use `multer` later.
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRouter);
app.use(healthRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Centralized error handler (keeps responses consistent and avoids leaking stack traces).
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected error";
  if (env.nodeEnv !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(500).json({ error: "Internal Server Error", message });
});

async function start(): Promise<void> {
  await connectDb();
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start:", err);
  process.exit(1);
});

