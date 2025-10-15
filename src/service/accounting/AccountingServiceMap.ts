// src/service/accounting/AccountingServiceMap.ts

import Account from "../../model/dtoTypes/Account.ts";
import LoginData from "../../model/dtoTypes/LoginData.ts";
import JwtUtil from "../../utils/security/JwtUtil.ts";
import AccountingService from "./AccountingService.ts";
import { AuthenticationError } from "../../model/errorTypes/aaaErrors.ts";
import passwordUtil from "../../utils/security/PasswordUtil.ts";
import { mockAdminData, mockUserData } from "../../utils/mockData.ts";

/**
 * Service implementation of {@link AccountingService} using an in-memory Map.
 * This is a mock version intended for testing and development.
 *
 * @class AccountingServiceMap
 * @implements {AccountingService}
 *
 * @example
 * const service = new AccountingServiceMap();
 * const token = service.login({ email: "user@tel-ran.com", password: "user123" });
 * console.log(token); // JWT token
 */
class AccountingServiceMap implements AccountingService {
	private _accounts: Map<string, Account> = new Map();

	constructor() {
		this._accounts.set(mockUserData.username, mockUserData);
		this._accounts.set(mockAdminData.username, mockAdminData);
	}

	/**
	 * Authenticates the provided login credentials and returns a JWT token.
	 *
	 * @param {LoginData} loginData - The login credentials (email and password).
	 * @returns {string} The generated JWT token upon successful authentication.
	 * @throws {Error} If the credentials are invalid.
	 *
	 * @example
	 * const token = service.login({ email: "admin@tel-ran.com", password: "admin123" });
	 * console.log(token);
	 */
	login(loginData: LoginData): string {
		const account: Account | undefined = this._accounts.get(
			loginData.email
		);

		if (
			!account ||
			!passwordUtil.verify(loginData.password, account.password)
		) {
			throw new AuthenticationError("Wrong credentials!");
		}

		return JwtUtil.getJWT(account);
	}
}

/**
 * Default exported singleton instance of {@link AccountingServiceMap}.
 * @constant
 */
const accountingService = new AccountingServiceMap();
export default accountingService;
