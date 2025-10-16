// src/model/errorTypes/aaaErrors.ts

/**
 * Error thrown when user authentication fails.
 * Typically used when the token is missing or invalid.
 * @extends Error
 * @example
 * throw new AuthenticationError();
 * // Throws an error with message "Authentication Error"
 */
export class AuthenticationError extends Error {
	constructor(message = "Authentication Error") {
		super(message);
		this.name = "AuthenticationError";
	}
}

/**
 * Error thrown when a user does not have permission to access a resource.
 * Typically used when a user role does not match route access rules.
 * @extends Error
 * @example
 * throw new AuthorizationError();
 * // Throws an error with message "Authorization Error"
 */
export class AuthorizationError extends Error {
	constructor(message = "Authorization Error") {
		super(message);
		this.name = "AuthorizationError";
	}
}

/**
 * Error thrown when login credentials are invalid.
 * Typically used when the provided username or password is incorrect.
 *
 * @extends Error
 * @example
 * throw new LoginError();
 * // Throws an error with message "Wrong Credentials"
 */
export class LoginError extends Error {
	constructor(message = "Wrong Credentials") {
		super(message);
		this.name = "LoginError";
	}
}
