// src/index.ts

import "./config/loadEnv.ts";
import { startServer } from "./server/app.ts";
import { fileStorage } from "./utils/fileStorage.ts";
import { employeesService } from "./service/employee/EmployeesServiceMap.ts";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
startServer(PORT);

/**
 * Gracefully shuts down the application by saving employees to file before exiting.
 * @param signal - The termination signal received (e.g., 'SIGINT', 'SIGTERM').
 * @returns {void}
 * @example
 * // On receiving SIGINT or SIGTERM signal
 * Received SIGINT. Saving employees...
 * // Employees are saved and application exits
 */
const shutdown = (signal: string) => {
	console.log(`Received ${signal}. Saving employees...`);
	fileStorage.saveEmployees(employeesService.toArray());
	process.exit(0);
};

// Handle termination signals to save data before exit
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
