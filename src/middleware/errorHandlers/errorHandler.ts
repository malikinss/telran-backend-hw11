// src/middleware/errorHandlers/errorHandler.ts

import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { extractZodErrorMessage } from "./zodMessageExtractor.ts";
import { LoginError } from "../../model/errorTypes/aaaErrors.ts";

/**
 * Mapping of known error names to corresponding HTTP status codes.
 */
const ERROR_STATUS: Record<string, number> = {
	AlreadyExistsError: 409,
	NotFoundError: 404,
	AuthenticationError: 401,
	AuthorizationError: 403,
	ZodError: 400,
	LoginError: 400,
};

/**
 * Express error-handling middleware.
 * Catches thrown errors in routes or controllers and sends
 * a standardized JSON response with appropriate HTTP status.
 *
 * @param {unknown} err - The error object thrown in a route or middleware.
 * @param {Request} _req - The Express request object (unused here).
 * @param {Response} res - The Express response object to send JSON error.
 * @param {NextFunction} _next - The next middleware function (not used, required for Express).
 *
 * @example
 * app.use(errorHandler);
 * // Handles errors thrown in routes automatically
 */
export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	const { status, name, message } = extractErrorData(err);

	console.error(`[${status}] ${name}: ${message}`);

	res.status(status).json({ error: { name, message, status } });
}

/**
 * Extracts standardized error data from any thrown error.
 * Handles known error types and provides defaults for unknown ones.
 *
 * @param {unknown} err - The error object to extract data from.
 * @returns {{ status: number; name: string; message: string }}
 *   Object containing the HTTP status code, error name, and message.
 *
 * @example
 * const data = extractErrorData(new NotFoundError("123"));
 * // Returns: { status: 404, name: "NotFoundError", message: "Employee with id 123 not found" }
 */
function extractErrorData(err: unknown): {
	status: number;
	name: string;
	message: string;
} {
	if (err instanceof ZodError) {
		return {
			name: "ZodError",
			status: ERROR_STATUS.ZodError,
			message: extractZodErrorMessage(err) || "Invalid data format",
		};
	}

	if (err instanceof Error) {
		const status = ERROR_STATUS[err.name] ?? 500;
		return {
			name: err.name,
			status,
			message: err.message || "Internal Server Error",
		};
	}

	// Fallback for non-error throws
	return {
		name: "UnknownError",
		status: 500,
		message: "Unexpected error occurred",
	};
}
