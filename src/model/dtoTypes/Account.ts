// src/model/dtoTypes/Account.ts

/**
 * Data Transfer Object (DTO) representing a user account.
 * Contains essential information for authentication and authorization.
 *
 * @interface Account
 * @property {string} username - Unique username identifying the account.
 * @property {string} role - Role of the user (e.g., "admin", "user", "manager").
 * @property {string} password - User's password in plain text (should be securely hashed before storage).
 *
 * @example
 * const account: Account = {
 *   username: "john_doe",
 *   role: "admin",
 *   password: "superSecret123"
 * };
 *
 * // Example usage:
 * accountService.createAccount(account);
 */
export default interface Account {
	username: string;
	role: string;
	password: string;
}
