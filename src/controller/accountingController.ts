// src/controller/accountingController.ts

import { Request, Response, NextFunction } from "express";
import accountingService from "../service/accounting/AccountingServiceMap.ts";
import LoginData from "../model/dtoTypes/LoginData.ts";
import logger from "../utils/logger.ts";

const logPrefix = "[AccountingController]";
const messages = {
	start: (email: string) =>
		`${logPrefix} ℹ️  Received login attempt for: ${email}`,
	success: (email: string) =>
		`${logPrefix} ✅  Login successful for: ${email}.`,
	error: `${logPrefix} ❌  Login failed:`,
};

/**
 * Handles user login.
 * Verifies credentials and returns a JWT token if successful.
 *
 * @route POST /login
 * @param {Request} req - Express request object containing LoginData in body
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 *
 * @example
 * POST /login
 * {
 *   "email": "admin@tel-ran.com",
 *   "password": "Admin12345"
 * }
 *
 * Response:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5..."
 * }
 */
export function login(req: Request, res: Response, next: NextFunction): void {
	try {
		const data: LoginData = req.body as LoginData;

		// Log received login data (without password for security)
		logger.debug(messages.start(data.email));

		const result = accountingService.login(data);

		// Log success with token length only (avoid full JWT in logs for security)
		logger.info(messages.success(data.email));

		res.status(200).json(result);
	} catch (error) {
		logger.error(messages.error, (error as Error).message);
		next(error);
	}
}
