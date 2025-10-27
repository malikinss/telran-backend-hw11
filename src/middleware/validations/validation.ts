// src/middleware/validations/validation.ts

import { ZodType } from "zod";
import { RequestHandler } from "express";
import logger from "../../utils/logger.ts";

const logPrefix = "[Validation]";
const messages = {
	success: `${logPrefix} ✅  Validation passed`,
	start: `${logPrefix} ℹ️  Validating request body`,
	error: `${logPrefix} ❌  Validation failed`,
};

/**
 * Middleware for validating request body using a Zod schema.
 * Throws a ZodError if validation fails.
 *
 * @param {ZodType} schema - The Zod schema used to validate the request body.
 * @returns {RequestHandler} Express middleware function.
 *
 * @example
 * import { employeeSchema } from "../../model/validation/employeeSchema";
 * app.post("/employees", validate(employeeSchema), addEmployee);
 */
export default function validate(
	schema: ZodType<any, any, any>
): RequestHandler {
	return (req, _res, next) => {
		logger.debug(messages.start);
		const result = schema.safeParse(req.body);
		if (!result.success) {
			logger.error(messages.error);
			throw result.error;
		}
		logger.info(messages.success);
		next();
	};
}
