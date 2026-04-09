"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
exports.healthRouter = (0, express_1.Router)();
exports.healthRouter.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "secure-vault-backend",
        time: new Date().toISOString()
    });
});
//# sourceMappingURL=healthRoutes.js.map