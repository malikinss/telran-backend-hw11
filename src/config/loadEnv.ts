// src/config/loadEnv.ts

import dotenv from "dotenv";
import path from "path";
import logger from "../utils/logger.ts";

/**
 * Loads environment variables from a `.env` file at the project root.
 * Logs a message confirming that environment variables will be available.
 *
 * @example
 * import "./config/loadEnv";
 * console.log(process.env.SOME_VARIABLE);
 */
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const logPrefix = "[LoadEnv]";
logger.info(
	`${logPrefix} ✅ .env loaded, environment variables are now available`
);
