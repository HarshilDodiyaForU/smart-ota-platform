"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signAccessToken(payload) {
    // HS256 using server-side secret. Ensure TLS in production so credentials/tokens aren't exposed.
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, {
        expiresIn: "7d"
    });
}
//# sourceMappingURL=jwt.js.map