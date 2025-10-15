// src/model/dtoTypes/LoginData.ts

/**
 * Data Transfer Object (DTO) representing login credentials.
 * Used for user authentication requests.
 *
 * @interface LoginData
 * @property {string} email - User's email address used for authentication.
 * @property {string} password - User's password in plain text (to be hashed or verified server-side).
 *
 * @example
 * const credentials: LoginData = {
 *   email: "user@example.com",
 *   password: "mySecurePassword123"
 * };
 *
 * // Example usage in authentication service:
 * authService.login(credentials);
 */
export default interface LoginData {
	email: string;
	password: string;
}
