"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const SALT_ROUNDS = 12;
const DUMMY_HASH = bcrypt_1.default.hashSync("invalid-password", SALT_ROUNDS);
function normalizeEmail(input) {
    if (typeof input !== "string")
        return "";
    return input.trim().toLowerCase();
}
function isValidEmail(email) {
    // Simple, safe baseline (avoids catastrophic backtracking).
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function getPassword(input) {
    if (typeof input !== "string")
        return "";
    // Preserve internal spaces; just trim accidental surrounding whitespace.
    return input.trim();
}
async function register(req, res) {
    const email = normalizeEmail(req.body.email);
    const password = getPassword(req.body.password);
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
    const existing = await User_1.User.findOne({ email }).select("_id").lean();
    if (existing) {
        res.status(409).json({ error: "Conflict", message: "Email already registered" });
        return;
    }
    const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    try {
        const user = await User_1.User.create({ email, passwordHash, role: "user" });
        const token = (0, jwt_1.signAccessToken)({ sub: user._id.toString(), role: user.role });
        res.status(201).json({
            token,
            user: { id: user._id.toString(), email: user.email, role: user.role }
        });
    }
    catch (err) {
        // Handle race-condition duplicate key (unique email index).
        if (typeof err === "object" &&
            err !== null &&
            "code" in err &&
            err.code === 11000) {
            res.status(409).json({ error: "Conflict", message: "Email already registered" });
            return;
        }
        throw err;
    }
}
async function login(req, res) {
    const email = normalizeEmail(req.body.email);
    const password = getPassword(req.body.password);
    if (!isValidEmail(email) || password.length === 0) {
        res.status(400).json({ error: "Bad Request", message: "Invalid email or password" });
        return;
    }
    const user = await User_1.User.findOne({ email }).exec();
    const passwordHash = user?.passwordHash ?? DUMMY_HASH;
    const ok = await bcrypt_1.default.compare(password, passwordHash);
    if (!user || !ok) {
        res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
        return;
    }
    const token = (0, jwt_1.signAccessToken)({ sub: user._id.toString(), role: user.role });
    res.status(200).json({
        token,
        user: { id: user._id.toString(), email: user.email, role: user.role }
    });
}
//# sourceMappingURL=authController.js.map