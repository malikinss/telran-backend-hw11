// src/model/errorTypes/employeeErrors.ts

/**
 * Error thrown when trying to add an employee that already exists.
 * @extends Error
 * @example
 * throw new AlreadyExistsError("123");
 * // Throws an error with message "Employee with id 123 already exists"
 */
export class AlreadyExistsError extends Error {
	constructor(id: string) {
		super(`Employee with id ${id} already exists`);
		this.name = "AlreadyExistsError";
	}
}

/**
 * Error thrown when an employee is not found.
 * @extends Error
 * @example
 * throw new NotFoundError("123");
 * // Throws an error with message "Employee with id 123 not found"
 */
export class NotFoundError extends Error {
	constructor(id: string) {
		super(`Employee with id ${id} not found`);
		this.name = "NotFoundError";
	}
}
