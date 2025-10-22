// src/__tests__/loginRoutesTests/loginPostRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import { app } from "../allRoutes.test.ts";

/**
 * Helper to test POST /login with various credentials.
 *
 * @param {string} label - Descriptive label for logging
 * @param {object} credentials - The login payload
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {string} [expectedMessage] - Expected message for error responses
 * @returns {Promise<supertest.Response>} - The HTTP response
 */
export async function testPostLogin(
	label: string,
	credentials: any,
	expectedStatus: number,
	expectedMessage?: string
) {
	console.log(`🧪 ${label}`);
	const response = await supertest(app).post("/login").send(credentials);

	console.log(`🔸 Response: ${response.statusCode}`);
	assert.equal(response.statusCode, expectedStatus);

	if (expectedStatus === 200) {
		assert.ok(response.body?.token, "Expected token in response");
		console.log(`✅ ${label}: login succeeded`);
	} else if (expectedMessage) {
		// check error message
		assert.equal(response.body?.error?.message, expectedMessage);
		console.log(
			`⚠️ ${label}: login failed as expected with message "${expectedMessage}"`
		);
	} else {
		console.log(`⚠️ ${label}: login failed as expected`);
	}

	return response;
}
