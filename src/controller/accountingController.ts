// src/controller/accountingController.ts

import { Request, Response, NextFunction } from "express";
import accountingService from "../service/accounting/AccountingServiceMap.ts";
import LoginData from "../model/dtoTypes/LoginData";

/**
 * Handles user login.
 * Verifies credentials and returns a JWT token if successful.
 *
 * @route POST /auth
 * @param {Request} req - Express request object containing LoginData in body
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 *
 * @example
 * POST /login
 * {
 *   "username": "admin@tel-ran.com",
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
		const token = accountingService.login(data);
		res.status(200).json({ token });
	} catch (error) {
		next(error);
	}
}
