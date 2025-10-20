// src/middleware/auth/auth.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import JwtUtil from "../../utils/security/JwtUtil.ts";
import {
	AuthenticationError,
	AuthorizationError,
} from "../../model/errorTypes/aaaErrors.ts";

const BEARER_PREFIX = "Bearer ";
const logPrefix = "[AuthMiddleware]";

/**
 * Extended Request type that includes authentication fields.
 */
interface AuthenticatedRequest extends Request {
	username?: string;
	role?: string;
}

/**
 * Middleware for authenticating incoming requests using JWT.
 * Extracts and verifies the token from the Authorization header.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - Function to pass control to the next middleware.
 * @throws {AuthenticationError} If the token is missing or invalid.
 *
 * @example
 * app.use(authenticate);
 */
export function authenticate(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void {
	const authHeader = req.header("Authorization");

	if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
		console.warn(`${logPrefix} Missing or malformed Authorization header`);
		throw new AuthenticationError();
	}

	const token = authHeader.slice(BEARER_PREFIX.length).trim();

	try {
		const payload = JwtUtil.verifyToken(token);
		req.username = payload.sub as string;
		req.role = payload.role as string;

		console.log(
			`${logPrefix} Authenticated user: ${req.username}, role: ${req.role}`
		);
		next();
	} catch (err) {
		console.error(`${logPrefix} Invalid token`, err);
		throw new AuthenticationError();
	}
}

/**
 * Middleware factory for authorizing users based on their role.
 * Ensures the authenticated user has one of the allowed roles.
 *
 * @param {string[]} roles - The list of allowed roles.
 * @returns {RequestHandler} Middleware function enforcing role-based access.
 * @throws {AuthenticationError} If user is not authenticated.
 * @throws {AuthorizationError} If user's role is not permitted.
 *
 * @example
 * app.get("/admin", auth(["ADMIN"]), (req, res) => { ... });
 */
export function auth(roles: string[]): RequestHandler {
	return (
		req: AuthenticatedRequest,
		_res: Response,
		next: NextFunction
	): void => {
		if (!req.role) {
			console.warn(`${logPrefix} Unauthorized access attempt`);
			throw new AuthenticationError();
		}

		if (!roles.includes(req.role)) {
			console.warn(
				`${logPrefix} Forbidden: User ${req.username} with role ${req.role} tried to access restricted route`
			);
			throw new AuthorizationError();
		}

		console.log(
			`${logPrefix} Authorized user: ${req.username}, role: ${req.role}`
		);
		next();
	};
}
