import dns from "node:dns";
import mongoose from "mongoose";

import { env } from "./env";

/**
 * Workaround for Windows/Node.js DNS SRV resolution bug:
 * - querySrv ECONNREFUSED when resolving _mongodb._tcp.* for Atlas SRV URIs
 * - Local resolver often fails; Cloudflare/Google DNS bypass the broken resolver
 *
 * Apply BEFORE mongoose.connect() so SRV lookups use these servers.
 */
dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1"]);

export async function connectDb(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
}
