// src/middleware/errorHandlers/zodMessageExtractor.ts

import { ZodError } from "zod";

/** Extracts and formats error messages from a ZodError.
 * @param {ZodError} error - The ZodError object.
 * @returns {string} A formatted string of error messages.
 * @example
 * const zodError = new ZodError([...]);
 * const errorMessage = extractZodErrorMessage(zodError);
 * // errorMessage might be "fullName: Full Name is required; salary: Salary must be a positive number"
 */
export function extractZodErrorMessage(error: ZodError): string {
	return error.issues.reduce(
		(result: string, issue) =>
			result +
			`${result ? "; " : ""}${issue.path[0].toString()}: ${
				issue.message
			}`,
		""
	);
}
