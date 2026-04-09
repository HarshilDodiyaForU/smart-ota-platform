"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        // Fail fast on missing config. In production, this prevents unsafe defaults.
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function parsePort(raw) {
    const port = Number(raw);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error(`Invalid PORT: ${raw}`);
    }
    return port;
}
exports.env = Object.freeze({
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: parsePort(process.env.PORT ?? "5000"),
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    jwtSecret: requireEnv("JWT_SECRET"),
    mongoUri: requireEnv("MONGO_URI")
});
//# sourceMappingURL=env.js.map