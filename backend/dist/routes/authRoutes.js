"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authController_1 = require("../controllers/authController");
exports.authRouter = (0, express_1.Router)();
// Stricter limiter for credential endpoints.
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false
});
exports.authRouter.post("/register", authLimiter, authController_1.register);
exports.authRouter.post("/login", authLimiter, authController_1.login);
//# sourceMappingURL=authRoutes.js.map