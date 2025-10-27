// src/utils/gracefulShutdown.ts

import { fileStorage } from "./fileStorage.ts";
import { employeesService } from "../service/employee/EmployeesServiceMap.ts";
import logger from "./logger.ts";

const logPrefix = "[Shutdown]";

const messages = {
	start: (signal: string) =>
		`${logPrefix} ⚠️  Received ${signal}. Attempting to save employees before exit...`,
	success: `${logPrefix} ✅  Employees saved successfully.`,
	error: `${logPrefix} ❌  Error saving employees during shutdown:`,
	noChanges: `${logPrefix} ℹ️  No changes detected. Nothing to save.`,
};

/**
 * Gracefully shuts down the application.
 * Persists in-memory employees to file before exiting the process.
 *
 * @param {string} signal - The system signal that triggered shutdown (e.g., "SIGINT", "SIGTERM").
 *
 * @example
 * process.on("SIGINT", () => gracefulShutdown("SIGINT"));
 */
export default function gracefulShutdown(signal: string): void {
	logger.debug(messages.start(signal));

	try {
		const employees = employeesService.toArray();
		const isUpdated = employeesService.isUpdated();

		if (isUpdated) {
			fileStorage.saveEmployees(employees, isUpdated);
			logger.info(messages.success);
		} else {
			logger.warn(messages.noChanges);
		}
	} catch (error) {
		logger.error(messages.error, error);
	} finally {
		// Ensure the process always exits after shutdown
		process.exit(0);
	}
}
