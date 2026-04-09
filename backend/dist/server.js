"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const authRoutes_1 = require("./routes/authRoutes");
const healthRoutes_1 = require("./routes/healthRoutes");
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
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.set("trust proxy", 1); // needed for correct IPs behind reverse proxies (rate limiting, logs)
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.corsOrigin,
    credentials: true
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false
}));
// JSON parsing is fine for auth/metadata; file uploads will use `multer` later.
app.use(express_1.default.json({ limit: "1mb" }));
app.use(authRoutes_1.authRouter);
app.use(healthRoutes_1.healthRouter);
app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
});
// Centralized error handler (keeps responses consistent and avoids leaking stack traces).
app.use((err, _req, res, _next) => {
    const message = err instanceof Error ? err.message : "Unexpected error";
    if (env_1.env.nodeEnv !== "production") {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(500).json({ error: "Internal Server Error", message });
});
async function start() {
    await (0, db_1.connectDb)();
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
    app.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Backend listening on http://localhost:${env_1.env.port}`);
    });
}
start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map