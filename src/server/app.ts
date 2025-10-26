// src/server/app.ts

import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import _ from "lodash";
import employeeRoutes from "../route/employeeRoutes.ts";
import authRoutes from "../route/authRoutes.ts";
import { errorHandler } from "../middleware/errorHandlers/errorHandler.ts";
import { authenticate } from "../middleware/auth/auth.ts";
import shutdown from "../utils/gracefulShutdown.ts";
import logger from "../utils/logger.ts";
import "../config/loadEnv.ts"; // ✅ Ensures .env is loaded before app starts

const logPrefix = "[Server]";

/**
 * Creates and configures an Express application.
 *
 * @returns {Express} A fully configured Express application instance.
 */
export function createApp(): Express {
	const app = express();

	logger.debug(`${logPrefix} ℹ️  Initializing Express app...`);

	// Middleware: Core
	logger.debug(`${logPrefix} ℹ️  Applying core middleware`);
	app.use(express.json());
	app.use(cors());
	app.use((req, _, next) => {
		logger.http(
			`${logPrefix} ℹ️  Incoming request: ${req.method} ${req.url}`
		);
		next();
	});

	// Uncomment to enable authentication globally
	// app.use(authenticate);

	// Morgan logging configuration
	const morganFormat = process.env.MORGAN_FORMAT || "tiny";
	const skipCodeThreshold = Number(process.env.SKIP_CODE_THRESHOLD) || 400;

	if (morganFormat !== "none") {
		logger.debug(`${logPrefix} ℹ️  Configuring morgan logger`);
		app.use(
			morgan(morganFormat, {
				skip: (_, res) => res.statusCode < skipCodeThreshold,
			})
		);
	}

	// Routes
	logger.debug(`${logPrefix} ℹ️  Setting up routes`);
	app.use("/employees", authenticate, employeeRoutes);
	app.use("/login", authRoutes);

	// Error handler
	logger.debug(`${logPrefix} ℹ️  Adding error handler middleware`);
	app.use(errorHandler);

	logger.debug(`${logPrefix} ✅ App initialization complete`);
	return app;
}

/**
 * Starts the Express server on the specified port.
 *
 * @param {Express} app -
 * @param {number} port - The port number to start the server on.
 */
export function startServer(app: Express, port: number): void {
	app.listen(port, () => {
		logger.info(
			`${logPrefix} 🚀 Server is running at http://localhost:${port}`
		);
	});

	process.on("SIGINT", () => {
		logger.info(`${logPrefix} ℹ️  Received SIGINT`);
		shutdown("SIGINT");
	});
	process.on("SIGTERM", () => {
		logger.info(`${logPrefix} ℹ️  Received SIGTERM`);
		shutdown("SIGTERM");
	});
}
