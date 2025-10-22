// src/__tests__/testData/userTestData.test.ts

import JwtUtil from "../../utils/security/JwtUtil.ts";
import Account from "../../model/dtoTypes/Account.ts";
import LoginData from "../../model/dtoTypes/LoginData.ts";

/**
 * 🧍‍♂️ Base test user account (for token generation)
 */
const testUser: Account = {
	username: "user@tel-ran.com",
	role: "USER",
	password: "password", // used only for JWT generation
};

/**
 * 🔐 JWT token and authorization header
 */
const userToken = JwtUtil.getJWT(testUser);
const userAuthHeader = JwtUtil.createAuthHeader(userToken);

/**
 * 💾 Login data for authentication tests
 */
const loginCorrect: LoginData = {
	email: "user@tel-ran.com",
	password: "user12345",
};

const loginIncorrect: LoginData = {
	email: "user@tel-ran.com",
	password: "user1234",
};

/**
 * 📦 Unified export for user-related test data
 */
export const userTestData = {
	testUser,
	userToken,
	userAuthHeader,
	loginCorrect,
	loginIncorrect,
};
