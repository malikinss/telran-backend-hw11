// src/utils/gracefulShutdown.ts

import { fileStorage } from "./fileStorage.ts";
import { employeesService } from "../service/employee/EmployeesServiceMap.ts";

/**
 * Gracefully shuts down the application.
 * Persists in-memory employees to file before exiting.
 *
 * @param {string} signal - The system signal that triggered shutdown (e.g. "SIGINT", "SIGTERM").
 *
 * @example
 * process.on("SIGINT", () => gracefulShutdown("SIGINT"));
 */
export function gracefulShutdown(signal: string): void {
	console.log(
		`⚠️ Received ${signal}. Attempting to save employees before exit...`
	);
	try {
		const employees = employeesService.toArray();
		const isUpdated = employeesService.isUpdated();

		if (isUpdated) {
			fileStorage.saveEmployees(employees, isUpdated);
			console.log("✅ Employees saved successfully.");
		} else {
			console.log("ℹ️ No changes detected. Nothing to save.");
		}
	} catch (error) {
		console.error("❌ Error saving employees during shutdown:", error);
	} finally {
		process.exit(0);
	}
}
