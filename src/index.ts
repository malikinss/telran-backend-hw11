// src/index.ts

import "./config/loadEnv.ts";
import { startServer } from "./server/app.ts";
import { gracefulShutdown } from "./utils/gracefulShutdown.ts";

/**
 * Reads the port from environment or defaults to 3000.
 */
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Start the Express server
startServer(PORT);

/**
 * Attach graceful shutdown handlers for system termination signals.
 * Ensures in-memory employees are saved before exiting.
 */
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
