// src/__tests__/testData/adminTestData.test.ts

import JwtUtil from "../../utils/security/JwtUtil.ts";
import Account from "../../model/dtoTypes/Account.ts";

/**
 * 👑 Base admin account used for tests.
 */
const adminUser: Account = {
	username: "admin@tel-ran.com",
	role: "ADMIN",
	password: "password", // used only for JWT generation
};

/**
 * 🔐 JWT token and Authorization header for admin user.
 */
const adminToken = JwtUtil.getJWT(adminUser);
const adminAuthHeader = JwtUtil.createAuthHeader(adminToken);

/**
 * 📦 Unified export for admin-related test data.
 */
export const adminTestData = {
	adminUser,
	adminToken,
	adminAuthHeader,
};
