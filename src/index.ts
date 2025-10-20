// src/index.ts

import "./config/loadEnv.ts";
import { startServer } from "./server/app.ts";

/**
 * Reads the port from environment or defaults to 3000.
 */
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Start the Express server
startServer(PORT);
