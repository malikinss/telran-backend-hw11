// src/service/accounting/AccountingServiceMap.ts

import Account from "../../model/dtoTypes/Account.ts";
import LoginData from "../../model/dtoTypes/LoginData.ts";
import JwtUtil from "../../utils/security/JwtUtil.ts";
import AccountingService from "./AccountingService.ts";
import { AuthenticationError } from "../../model/errorTypes/aaaErrors.ts";
import passwordUtil from "../../utils/security/PasswordUtil.ts";
import { mockAdminData, mockUserData } from "../../utils/mockData.ts";

const logPrefix = "[AccountingService]";

/**
 * Service implementation of {@link AccountingService} using an in-memory Map.
 * This is a mock version intended for testing and development.
 *
 * @class AccountingServiceMap
 * @implements {AccountingService}
 */
class AccountingServiceMap implements AccountingService {
	private _accounts: Map<string, Account> = new Map();

	constructor() {
		console.log(`${logPrefix} Initializing in-memory accounts...`);
		this._accounts.set(mockUserData.username, mockUserData);
		this._accounts.set(mockAdminData.username, mockAdminData);
	}

	/**
	 * Authenticates the provided login credentials and returns a JWT token and user data.
	 *
	 * @param {LoginData} loginData - The login credentials (email and password).
	 * @returns {object} The object with generated JWT token upon successful authentication and user data.
	 * @throws {AuthenticationError} If the credentials are invalid.
	 */
	login(loginData: LoginData): object {
		console.log(
			`${logPrefix} Login attempt for email: ${loginData.email}`
		);

		const account: Account | undefined = this._accounts.get(
			loginData.email
		);

		if (!account) {
			console.warn(`${logPrefix} User not found: ${loginData.email}`);
			throw new AuthenticationError("Wrong credentials!");
		}

		const passwordValid = passwordUtil.verify(
			loginData.password,
			account.password
		);
		if (!passwordValid) {
			console.warn(
				`${logPrefix} Invalid password for: ${loginData.email}`
			);
			throw new AuthenticationError("Wrong credentials!");
		}

		const token = JwtUtil.getJWT(account);
		console.log(`${logPrefix} Login successful for: ${loginData.email}`);

		return {
			accessToken: token,
			user: {
				email: account.username,
				role: account.role,
			},
		};
	}
}

/**
 * Default exported singleton instance of {@link AccountingServiceMap}.
 */
const accountingService = new AccountingServiceMap();
export default accountingService;
