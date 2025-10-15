// src/utils/security/PasswordUtil.ts

import bcrypt from "bcrypt";

/**
 * Utility class for password hashing and verification using bcrypt.
 *
 * Provides synchronous methods for generating secure password hashes
 * and verifying plain-text passwords against stored hashes.
 *
 * @class PasswordUtil
 * @example
 * const hash = passwordUtil.getHash("mySecret123");
 * console.log(hash);
 *
 * const isValid = passwordUtil.verify("mySecret123", hash);
 * console.log(isValid); // true
 */
class PasswordUtil {
	private readonly SALT_ROUNDS: number;

	/**
	 * Creates a new PasswordUtil instance.
	 *
	 * @param {number} saltRounds - The number of bcrypt salt rounds to use for hashing.
	 * @example
	 * const passwordUtil = new PasswordUtil(12);
	 */
	constructor(saltRounds: number = 12) {
		this.SALT_ROUNDS = saltRounds;
	}

	/**
	 * Generates a bcrypt hash for the given password.
	 *
	 * @param {string} password - The plain-text password to hash.
	 * @returns {string} The bcrypt hash of the password.
	 * @example
	 * const hash = passwordUtil.getHash("password123");
	 */
	getHash(password: string): string {
		return bcrypt.hashSync(password, this.SALT_ROUNDS);
	}

	/**
	 * Verifies whether a given plain-text password matches a bcrypt hash.
	 *
	 * @param {string} password - The plain-text password to check.
	 * @param {string} hash - The bcrypt hash to compare against.
	 * @returns {boolean} True if the password matches, false otherwise.
	 * @example
	 * passwordUtil.verify("password123", "$2b$12$...");
	 */
	verify(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}
}

/**
 * Singleton instance of PasswordUtil with default salt rounds (12).
 */
const passwordUtil = new PasswordUtil();

export default passwordUtil;
