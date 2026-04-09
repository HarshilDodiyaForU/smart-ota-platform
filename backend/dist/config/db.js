"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const node_dns_1 = __importDefault(require("node:dns"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
/**
 * Workaround for Windows/Node.js DNS SRV resolution bug:
 * - querySrv ECONNREFUSED when resolving _mongodb._tcp.* for Atlas SRV URIs
 * - Local resolver often fails; Cloudflare/Google DNS bypass the broken resolver
 *
 * Apply BEFORE mongoose.connect() so SRV lookups use these servers.
 */
node_dns_1.default.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1"]);
async function connectDb() {
    mongoose_1.default.set("strictQuery", true);
    await mongoose_1.default.connect(env_1.env.mongoUri);
}
//# sourceMappingURL=db.js.map