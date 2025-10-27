// src/middleware/auth/auth.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import JwtUtil from "../../utils/security/JwtUtil.ts";
import {
	AuthenticationError,
	AuthorizationError,
} from "../../model/errorTypes/aaaErrors.ts";
import logger from "../../utils/logger.ts";

const BEARER_PREFIX = "Bearer ";
const logPrefix = "[AuthMiddleware]";

const messages = {
	authenticate: {
		start: `${logPrefix} ℹ️  Authenthiciation started`,
		success: (username, role) =>
			`${logPrefix} ✅  Authenticated user: ${username}, role: ${role}`,
		warn: `${logPrefix} ⚠️  Missing or malformed Authorization header`,
		error: `${logPrefix} ❌ Invalid token`,
	},
	auth: {
		start: `${logPrefix}ℹ️  Authorization started`,
		warn1: `${logPrefix} ⚠️  Unauthorized access attempt`,
		success: (username, role) =>
			`${logPrefix} ✅  Authorized user: ${username}, role: ${role}`,
		warn2: (username, role) =>
			`${logPrefix} ⚠️  Forbidden: User ${username} with role ${role} tried to access restricted route`,
	},
};

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
	logger.debug(messages.authenticate.start);
	const authHeader = req.header("Authorization");

	if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
		logger.warn(messages.authenticate.warn);
		throw new AuthenticationError();
	}

	const token = authHeader.slice(BEARER_PREFIX.length).trim();

	try {
		const payload = JwtUtil.verifyToken(token);
		req.username = payload.sub as string;
		req.role = payload.role as string;

		logger.info(messages.authenticate.success(req.username, req.role));
		next();
	} catch (err) {
		logger.error(messages.authenticate.error, err);
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
		logger.debug(messages.auth.start);
		if (!req.role) {
			logger.warn(messages.auth.warn1);
			throw new AuthenticationError();
		}

		if (!roles.includes(req.role)) {
			logger.warn(messages.auth.warn2(req.username, req.role));
			throw new AuthorizationError();
		}

		logger.info(messages.auth.success(req.username, req.role));
		next();
	};
}
