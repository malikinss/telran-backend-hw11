// src/service/accounting/AccountingService.ts

import LoginData from "../../model/dtoTypes/LoginData.ts";

/**
 * Service interface for handling user authentication and login.
 * Defines the contract for verifying user credentials and returning a JWT or similar token.
 *
 * @interface AccountingService
 * @method login - Authenticates a user based on provided login credentials.
 *
 * @example
 * const userData = service.login({ email: "admin@example.com", password: "admin123" });
 * console.log(userData); // e.g.,
 * {
 * 	acessToken: "any token",
 * 	user: {
 * 		email: userEmail,
 * 		id: userId (temporary user role)
 * 	}
 * }
 */
export default interface AccountingService {
	/**
	 * Authenticates a user and returns an authentication token.
	 *
	 * @param {LoginData} loginData - The user's login credentials (email and password).
	 * @returns {string} A signed JWT token if authentication succeeds.
	 * @throws {AuthenticationError} If the credentials are invalid.
	 *
	 * @example
	 * const userData = service.login({ email: "admin@example.com", password: "admin123" });
	 * console.log(userData); // e.g.,
	 * {
	 * 	acessToken: "any token",
	 * 	user: {
	 * 		email: userEmail,
	 * 		id: userId (temporary user role)
	 * 	}
	 * }
	 */
	login(loginData: LoginData): object;
}
