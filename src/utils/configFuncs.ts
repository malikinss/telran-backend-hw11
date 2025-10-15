// src/utils/configFuncs.ts

/**
 * Default configuration values for salary, age, and departments.
 */
const DEFAULTS = {
	SALARY: {
		MIN: { name: "MIN_SALARY", value: 5000 },
		MAX: { name: "MAX_SALARY", value: 50000 },
	},
	AGE: {
		MIN: { name: "MIN_AGE", value: 20 },
		MAX: { name: "MAX_AGE", value: 72 },
	},
	DEPARTMENTS: ["QA", "Development", "Audit", "Accounting", "Management"],
};

/**
 * Returns the minimum allowed salary from environment or defaults.
 * @returns {number} Minimum salary value.
 * @example
 * const min = getMinSalary();
 * // => 5000 (or from process.env.MIN_SALARY)
 */
export function getMinSalary(): number {
	return getNumberConfigValue(
		DEFAULTS.SALARY.MIN.name,
		DEFAULTS.SALARY.MIN.value
	);
}

/**
 * Returns the maximum allowed salary from environment or defaults.
 * @returns {number} Maximum salary value.
 * @example
 * const max = getMaxSalary();
 * // => 50000 (or from process.env.MAX_SALARY)
 */
export function getMaxSalary(): number {
	return getNumberConfigValue(
		DEFAULTS.SALARY.MAX.name,
		DEFAULTS.SALARY.MAX.value
	);
}

/**
 * Returns the minimum allowed employee age from environment or defaults.
 * @returns {number} Minimum age value.
 * @example
 * const min = getMinAge();
 * // => 20 (or from process.env.MIN_AGE)
 */
export function getMinAge(): number {
	return getNumberConfigValue(DEFAULTS.AGE.MIN.name, DEFAULTS.AGE.MIN.value);
}

/**
 * Returns the maximum allowed employee age from environment or defaults.
 * @returns {number} Maximum age value.
 * @example
 * const max = getMaxAge();
 * // => 72 (or from process.env.MAX_AGE)
 */
export function getMaxAge(): number {
	return getNumberConfigValue(DEFAULTS.AGE.MAX.name, DEFAULTS.AGE.MAX.value);
}

/**
 * Returns the list of departments from environment or defaults.
 * @returns {string[]} List of departments.
 * @example
 * const deps = getDepartments();
 * // => ["QA", "Development", "Audit", "Accounting", "Management"]
 */
export function getDepartments(): string[] {
	const envDepartments = process.env.DEPARTMENTS;
	if (envDepartments) {
		// Expected format: "QA,Development,Audit"
		return envDepartments.split(",").map((dep) => dep.trim());
	}
	return DEFAULTS.DEPARTMENTS;
}

/**
 * Retrieves a numeric configuration value from environment variables,
 * or returns a default value if not set or invalid.
 *
 * @param {string} variableName - The environment variable name.
 * @param {number} defaultValue - Default fallback value.
 * @returns {number} Parsed number or default value.
 * @example
 * getNumberConfigValue("MIN_SALARY", 5000);
 * // => 5000 (if not set)
 */
function getNumberConfigValue(
	variableName: string,
	defaultValue: number
): number {
	const rawValue = process.env[variableName];
	const parsed = Number(rawValue);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

/**
 * Calculates a date string representing a person born a given number of years ago.
 * @param {number} age - Age in years.
 * @returns {string} Date string in YYYY-MM-DD format.
 * @example
 * getDate(30);
 * // => "1995-10-12"
 */
export function getDate(age: number): string {
	const currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() - age);
	return currentDate.toISOString().substring(0, 10);
}

/**
 * Returns the maximum allowed birth date based on minimum employee age.
 * @returns {string} Date string in YYYY-MM-DD format.
 * @example
 * getMaxDate();
 * // => "2005-10-12"
 */
export function getMaxDate(): string {
	return getDate(getMinAge());
}

/**
 * Returns the minimum allowed birth date based on maximum employee age.
 * @returns {string} Date string in YYYY-MM-DD format.
 * @example
 * getMinDate();
 * // => "1953-10-12"
 */
export function getMinDate(): string {
	return getDate(getMaxAge());
}
