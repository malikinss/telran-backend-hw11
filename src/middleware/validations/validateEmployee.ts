// src/middleware/validations/validateEmployee.ts

import { ZodType } from "zod";
import { RequestHandler } from "express";

/**
 * Middleware for validating request body using a Zod schema.
 * Throws a ZodError if validation fails.
 *
 * @extends Error
 * @param {ZodType} schema - The Zod schema used to validate the request body.
 * @returns {RequestHandler} Express middleware function.
 * @example
 * import { employeeSchema } from "../../model/validation/employeeSchema";
 * app.post("/employees", validateEmployee(employeeSchema), addEmployee);
 */
export default function validateEmployee(
	schema: ZodType<any, any, any>
): RequestHandler {
	return (req, _res, next) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			throw result.error;
		}
		next();
	};
}
