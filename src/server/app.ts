// src/server/app.ts

import express from "express";
import morgan from "morgan";
import _ from "lodash";
import employeeRoutes from "../route/employeeRoutes.ts";
import authRoutes from "../route/authRoutes.ts";
import { errorHandler } from "../middleware/errorHandlers/errorHandler.ts";

/** Starts the Express server on the specified port.
 * @param {number} port - The port number to start the server on.
 * @returns {void}
 * @example
 * startServer(3000);
 * // Server is running on http://localhost:3000
 */
export function startServer(port: number) {
	// Load environment variables
	const morganFormat = process.env.MORGAN_FORMAT || "tiny";

	// Default to logging requests with status code >= 400
	const skipCodeThreshold = process.env.SKIP_CODE_THRESHOLD
		? parseInt(process.env.SKIP_CODE_THRESHOLD)
		: 400;

	// Initialize Express app
	const app = express();
	app.use(express.json());

	// Setup morgan for logging
	app.use(
		morgan(morganFormat, {
			skip: (_, res) => res.statusCode < skipCodeThreshold,
		})
	);

	// Define routes
	app.use("/api/employees", employeeRoutes);
	app.use("/api/login", authRoutes);

	// Error handling middleware
	app.use(errorHandler);

	// Start the server
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
}
