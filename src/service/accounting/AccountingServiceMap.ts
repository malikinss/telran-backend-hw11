// src/service/accounting/AccountingServiceMap.ts

import Account from "../../model/dtoTypes/Account.ts";
import LoginData from "../../model/dtoTypes/LoginData.ts";
import JwtUtil from "../../utils/security/JwtUtil.ts";
import AccountingService from "./AccountingService.ts";
import { LoginError } from "../../model/errorTypes/aaaErrors.ts";
import passwordUtil from "../../utils/security/PasswordUtil.ts";
import { mockAdminData, mockUserData } from "../../utils/mockData.ts";
import logger from "../../utils/logger.ts";

const logPrefix = "[AccountingService]";
const messages = {
	constructor: {
		start: `${logPrefix} ℹ️  Initializing in-memory accounts...`,
		success: (size: number) =>
			`${logPrefix} ✅  Accounts initialized successfully. Total: ${size}`,
	},
	login: {
		start: (email: string) =>
			`${logPrefix} ℹ️  Login attempt for email: ${email}`,
		found: (email: string) =>
			`${logPrefix} 🔍  Account found for email: ${email}`,
		warn: {
			notFound: (email: string) =>
				`${logPrefix} ⚠️  User not found: ${email}`,
			wrongPswrd: (email: string) =>
				`${logPrefix} ⚠️  Invalid password for: ${email}`,
		},
		success: (email: string) =>
			`${logPrefix} ✅  Login successful for: ${email}`,
		error: (email: string, err: unknown) =>
			`${logPrefix} ❌  Login failed for ${email}: ${err}`,
	},
};

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
		logger.debug(messages.constructor.start);
		this._accounts.set(mockUserData.username, mockUserData);
		this._accounts.set(mockAdminData.username, mockAdminData);
		logger.debug(messages.constructor.success(this._accounts.size));
	}

	/**
	 * Authenticates the provided login credentials and returns a JWT token and user data.
	 *
	 * @param {LoginData} loginData - The login credentials (email and password).
	 * @returns {object} The object with generated JWT token upon successful authentication and user data.
	 * @throws {AuthenticationError} If the credentials are invalid.
	 */
	login(loginData: LoginData): object {
		logger.debug(messages.login.start(loginData.email));
		const account: Account | undefined = this._accounts.get(
			loginData.email
		);

		if (!account) {
			logger.warn(messages.login.warn.notFound(loginData.email));
			throw new LoginError();
		}

		logger.debug(messages.login.found(loginData.email));

		const passwordValid = passwordUtil.verify(
			loginData.password,
			account.password
		);
		if (!passwordValid) {
			logger.warn(messages.login.warn.wrongPswrd(loginData.email));
			throw new LoginError();
		}

		const accessToken = JwtUtil.getJWT(account);
		logger.info(messages.login.success(loginData.email));

		return {
			accessToken: accessToken,
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
