// src/utils/security/JwtUtil.ts

import jwt, { JwtPayload } from "jsonwebtoken";
import Account from "../../model/dtoTypes/Account.ts";

/**
 * Loads JWT secret key from environment and validates its existence.
 */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("❌ Missing required environment variable: JWT_SECRET");
}

/**
 * 🛡️ JwtUtil — utility class for handling JSON Web Tokens (JWT).
 * Provides static methods for token creation, verification, and header formatting.
 *
 * @example
 * const token = JwtUtil.getJWT({ username: "john", role: "ADMIN", password: "secret" });
 * const payload = JwtUtil.verifyToken(token);
 * console.log(payload.role); // ADMIN
 */
export default class JwtUtil {
	/**
	 * 🔐 Generates a signed JWT for a given user account.
	 *
	 * @param {Account} account - Account containing `username` and `role`.
	 * @returns {string} Signed JWT token.
	 *
	 * @example
	 * const token = JwtUtil.getJWT(userAccount);
	 */
	static getJWT(account: Account): string {
		if (!account?.username || !account?.role) {
			throw new Error(
				"Invalid account data: username and role are required"
			);
		}

		return jwt.sign({ role: account.role }, JWT_SECRET, {
			subject: account.username,
			expiresIn: "1h", // ⏱️ optionally limit token lifetime
		});
	}

	/**
	 * 🔍 Verifies a JWT token and returns its decoded payload.
	 *
	 * @param {string} token - JWT token string.
	 * @returns {JwtPayload} Decoded payload object.
	 * @throws {Error} If token is invalid or expired.
	 *
	 * @example
	 * const payload = JwtUtil.verifyToken(token);
	 */
	static verifyToken(token: string): JwtPayload {
		if (!token || typeof token !== "string") {
			throw new Error("Invalid token: must be a non-empty string");
		}

		try {
			return jwt.verify(token, JWT_SECRET) as JwtPayload;
		} catch (error) {
			throw new Error(
				"Token verification failed: " + (error as Error).message
			);
		}
	}

	/**
	 * 🪪 Builds a valid Authorization header for a given JWT.
	 *
	 * @param {string} token - JWT token string.
	 * @returns {string} Header in the format `Bearer <token>`.
	 *
	 * @example
	 * const header = JwtUtil.createAuthHeader(token);
	 */
	static createAuthHeader(token: string): string {
		return `Bearer ${token}`;
	}
}
