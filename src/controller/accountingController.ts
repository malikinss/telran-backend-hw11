// src/controller/accountingController.ts

import { Request, Response, NextFunction } from "express";
import accountingService from "../service/accounting/AccountingServiceMap.ts";
import LoginData from "../model/dtoTypes/LoginData.ts";

const logPrefix = "[AccountingController]";

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
	console.log(`${logPrefix} Login attempt received`);
	try {
		const data: LoginData = req.body as LoginData;

		// Log received login data (without password for security)
		console.log(`${logPrefix} Received login attempt for: ${data.email}`);

		const token = accountingService.login(data);

		// Log success with token length only (avoid full JWT in logs for security)
		console.log(`${logPrefix} Login successful for: ${data.email}.`);

		res.status(200).json({ token });
	} catch (error) {
		console.error(`${logPrefix} Login failed:`, (error as Error).message);
		next(error);
	}
}
