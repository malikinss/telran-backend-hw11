// src/utils/security/JwtUtil.ts

import jwt, { JwtPayload } from "jsonwebtoken";
import Account from "../../model/dtoTypes/Account.ts";

const secret = process.env.JWT_SECRET as string;
if (!secret) {
	throw new Error("Missing required environment variable: JWT_SECRET");
}
const JWT_SECRET: string = secret;

/**
 * Utility class for handling JSON Web Token (JWT) operations.
 * Provides methods for token generation and verification used in authentication and authorization.
 *
 * @class JwtUtil
 * @example
 * const token = JwtUtil.getJWT({ username: "john", role: "admin", password: "1234" });
 * console.log(token);
 *
 * const decoded = JwtUtil.verifyToken(token);
 * console.log(decoded.sub); // "john"
 */
export default class JwtUtil {
	/**
	 * Generates a signed JWT for a given user account.
	 *
	 * @param {Account} account - The account object containing username and role.
	 * @returns {string} The generated JWT string.
	 *
	 * @example
	 * const token = JwtUtil.getJWT({ username: "alice", role: "user", password: "secret" });
	 */
	static getJWT(account: Account): string {
		return jwt.sign({ role: account.role }, JWT_SECRET, {
			subject: account.username,
		});
	}

	/**
	 * Verifies a given JWT and returns its decoded payload.
	 *
	 * @param {string} token - The JWT string to verify.
	 * @returns {JwtPayload} The decoded JWT payload if verification succeeds.
	 * @throws {Error} Throws an error if the token is invalid or expired.
	 *
	 * @example
	 * try {
	 *   const payload = JwtUtil.verifyToken(token);
	 *   console.log(payload.role);
	 * } catch (err) {
	 *   console.error("Invalid token");
	 * }
	 */
	static verifyToken(token: string): JwtPayload {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	}
}
