import fs from "fs";
import path from "path";
import { WriteFileOptions } from "fs";
import { STORAGE_CONFIG } from "../config/storageConfig.ts";

/**
 * Converts data into a formatted JSON string.
 *
 * @param {unknown} data - Any data (array, object) to convert.
 * @returns {string} Formatted JSON string with 2-space indentation.
 */
function toPrettyJSON(data: unknown): string {
	return JSON.stringify(data, null, 2);
}

/**
 * Writes any data (object or array) to a JSON file with pretty formatting.
 * Ensures the directory exists before writing.
 *
 * @param {unknown} data - Data to save.
 * @param {string} [filePath=STORAGE_CONFIG.FILE_PATH] - File path to save JSON.
 * @param {WriteFileOptions} [encoding=STORAGE_CONFIG.ENCODING] - File encoding.
 *
 * @example
 * saveJsonToFile([{ id: "1", name: "Alice" }], "data/employees.json");
 */
export function saveJsonToFile(
	data: unknown,
	filePath: string = STORAGE_CONFIG.FILE_PATH,
	encoding: WriteFileOptions = STORAGE_CONFIG.ENCODING
): void {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, toPrettyJSON(data), encoding);
}
