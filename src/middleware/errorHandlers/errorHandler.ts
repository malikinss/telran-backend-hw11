// src/middleware/errorHandlers/errorHandler.ts

import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { extractZodErrorMessage } from "./zodMessageExtractor.ts";
import logger from "../../utils/logger.ts";

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

const logPrefix = "[ErrorHandler]";

/**
 * Express error-handling middleware.
 * Sends standardized JSON responses for all thrown errors.
 */
export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	const { status, name, message } = extractErrorData(err);

	logger.error(`${logPrefix} ❌  [${status}] ${name}: ${message}`);

	res.status(status).json({ error: { name, message, status } });
}

/**
 * Extracts standardized error data from any thrown error.
 */
function extractErrorData(err: unknown): {
	status: number;
	name: string;
	message: string;
} {
	// Special handling for Zod validation errors
	if (err instanceof ZodError) {
		return {
			name: "ZodError",
			status: ERROR_STATUS.ZodError,
			message: extractZodErrorMessage(err) || "Invalid data format",
		};
	}

	// Known Error instances
	if (err instanceof Error) {
		const status = ERROR_STATUS[err.name] ?? 500;
		return {
			name: err.name,
			status,
			message: err.message || "Internal Server Error",
		};
	}

	// Fallback for unknown throwables
	return {
		name: "UnknownError",
		status: 500,
		message: "Unexpected error occurred",
	};
}
