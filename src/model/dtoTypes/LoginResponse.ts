// src/model/dtoTypes/LoginResponse.ts

/**
 * Represents the response returned after a successful login.
 * Contains the generated access token and basic user information.
 *
 * @interface LoginResponse
 * @property {string} accessToken - The JWT access token for authentication.
 * @property {Object} user - The authenticated user details.
 * @property {string} user.email - The user's email address.
 * @property {string} user.id - The unique identifier of the user.
 */
export default interface LoginResponse {
	accessToken: string;
	user: {
		email: string;
		id: string;
	};
}
