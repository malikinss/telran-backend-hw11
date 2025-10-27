// src/utils/fileStorage.ts

import fs from "fs";
import { Employee } from "../model/dtoTypes/Employee.ts";
import { STORAGE_CONFIG } from "../config/storageConfig.ts";
import { saveJsonToFile } from "./saveJsonToFile.ts";
import logger from "./logger.ts";

const logPrefix = "[fileStorage]";
const messages = {
	saving: {
		success: `${logPrefix} ✅ Employees saved successfully.`,
		error: `${logPrefix} ❌ Failed to save employees:`,
		nothingToSave: `${logPrefix} ℹ️ Nothing to save — no changes detected.`,
	},
	loading: {
		error: `${logPrefix} ❌ Failed to load employees:`,
	},
};

/**
 * Ensures that the data directory and the employees file exist.
 * Creates them if missing to avoid runtime errors during read/write operations.
 *
 * @returns {void}
 * @example
 * ensureDataFileExists();
 * // Creates 'data/employees.json' with [] if it doesn't exist
 */
function ensureStorageReady(): void {
	if (!fs.existsSync(STORAGE_CONFIG.DATA_DIR)) {
		fs.mkdirSync(STORAGE_CONFIG.DATA_DIR, { recursive: true });
	}

	if (!fs.existsSync(STORAGE_CONFIG.FILE_PATH)) {
		saveJsonToFile([]);
	}
}

/**
 * Loads all employees from the JSON storage file.
 *
 * @returns {Employee[]} Array of Employee objects loaded from the file.
 * @throws {Error} If the file cannot be read or parsed.
 *
 * @example
 * const employees = fileStorage.loadEmployees();
 * console.log(employees);
 * // → [{ id: '1', fullName: 'John Doe', department: 'Development', ... }]
 */
function loadEmployees(): Employee[] {
	try {
		ensureStorageReady();
		const data = fs.readFileSync(STORAGE_CONFIG.FILE_PATH, {
			encoding: STORAGE_CONFIG.ENCODING,
		});
		return JSON.parse(data) as Employee[];
	} catch (error) {
		logger.error(messages.loading.error, error);
		return [];
	}
}

/**
 * Persists the provided list of employees into a JSON file.
 *
 * This function writes to the file only if the `isUpdated` flag is `true`.
 * Ensures that the data file exists before writing. Logs an error to the console
 * if the operation fails, or a message if there is nothing to save.
 *
 * @param {Employee[]} employees - The list of Employee objects to save.
 * @param {boolean} isUpdated - Whether the data has changed and needs to be saved.
 * @returns {void}
 *
 * @example
 * saveEmployees([
 *   { id: "1", fullName: "Jane Smith", department: "QA", salary: 12000 }
 * ], true);
 */
function saveEmployees(employees: Employee[], isUpdated: boolean): void {
	if (!isUpdated) {
		logger.warn(messages.saving.nothingToSave);
		return;
	}

	try {
		ensureStorageReady();
		saveJsonToFile(employees);
		logger.info(messages.saving.success);
	} catch (error) {
		logger.error(messages.saving.error, error);
	}
}

/**
 * Provides methods for persistent employee data storage.
 *
 * @namespace fileStorage
 * @property {Function} loadEmployees - Loads employees from disk.
 * @property {Function} saveEmployees - Saves employees to disk.
 *
 * @example
 * import { fileStorage } from "../utils/fileStorage";
 * const employees = fileStorage.loadEmployees();
 * employees.push(newEmployee);
 * fileStorage.saveEmployees(employees);
 */
export const fileStorage = {
	loadEmployees,
	saveEmployees,
};
