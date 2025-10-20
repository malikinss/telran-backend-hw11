// src/config/storageConfig.ts

import path from "path";
import { WriteFileOptions } from "fs";

/**
 * Default encoding used for reading and writing files.
 */
const ENCODING: WriteFileOptions = "utf-8";

/**
 * Centralized configuration for file storage.
 * Contains constants related to the employee data file.
 *
 * @property {string} ENCODING - File encoding (usually 'utf-8').
 * @property {string} DATA_DIR - Directory where data files are stored.
 * @property {string} FILE_NAME - Default JSON file name for employee storage.
 * @property {string} FILE_PATH - Absolute path combining DATA_DIR and FILE_NAME.
 */
export const STORAGE_CONFIG = {
	ENCODING,
	DATA_DIR: "data",
	FILE_NAME: "employees.json",
	FILE_PATH: path.resolve("data", "employees.json"),
};
