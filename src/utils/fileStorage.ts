// src/utils/fileStorage.ts

import fs from "fs";
import path from "path";
import { Employee } from "../model/dtoTypes/Employee.ts";

const ENCODING = "utf-8";
const DATA_DIR = path.resolve("data");
const FILE_PATH = path.join(DATA_DIR, "employees.json");

/**
 * Ensures that the data directory and the employees file exist.
 * Creates them if missing to avoid runtime errors during read/write operations.
 *
 * @returns {void}
 * @example
 * ensureDataFileExists();
 * // Creates 'data/employees.json' with [] if it doesn't exist
 */
function ensureDataFileExists(): void {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}

	if (!fs.existsSync(FILE_PATH)) {
		fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), ENCODING);
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
		ensureDataFileExists();
		const data = fs.readFileSync(FILE_PATH, ENCODING);
		return JSON.parse(data) as Employee[];
	} catch (error) {
		console.error("❌ Failed to load employees:", error);
		return [];
	}
}

/**
 * Saves the given array of employees to the JSON file.
 *
 * @param {Employee[]} employees - Array of Employee objects to persist.
 * @returns {void}
 *
 * @example
 * fileStorage.saveEmployees([
 *   { id: '1', fullName: 'Jane Smith', department: 'QA', salary: 12000 }
 * ]);
 */
function saveEmployees(employees: Employee[]): void {
	try {
		ensureDataFileExists();
		fs.writeFileSync(
			FILE_PATH,
			JSON.stringify(employees, null, 2),
			ENCODING
		);
	} catch (error) {
		console.error("❌ Failed to save employees:", error);
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
