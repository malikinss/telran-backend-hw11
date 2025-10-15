// src/utils/mockData.ts
import Account from "../model/dtoTypes/Account.ts";
import passwordUtil from "./security/PasswordUtil.ts";

/**
 * ⚠️ Mock data for demonstration only.
 * Passwords are pre-hashed for demo and testing purposes.
 */
export const mockAdminData: Account = {
	username: "admin@tel-ran.com",
	role: "ADMIN",
	password: passwordUtil.getHash("Admin12345"),
};

export const mockUserData: Account = {
	username: "user@tel-ran.com",
	role: "USER",
	password: passwordUtil.getHash("User12345"),
};
