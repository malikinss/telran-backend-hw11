// src/__tests__/loginRoutesTests/loginPostRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import test from "node:test";
import { app } from "../allRoutes.test.ts";
import logger from "../../utils/logger.ts";

import { userTestData } from "../testData/index.ts";
const { loginCorrect, loginIncorrect } = userTestData;

/**
 * Helper to test POST /login with various credentials.

 * @param {object} credentials - The login payload
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {string} [expectedMessage] - Expected message for error responses
 * @returns {Promise<supertest.Response>} - The HTTP response
 */
async function testPostLogin(
	credentials: any,
	expectedStatus: number,
	expectedMessage?: string
) {
	const response = await supertest(app).post("/login").send(credentials);

	logger.debug(`🔸 Response: ${response.statusCode}`);
	assert.equal(response.statusCode, expectedStatus);
	if (expectedStatus === 200) {
		assert.ok(
			response.body?.accessToken,
			"Expected accessToken in response"
		);
		logger.debug(`✅ login succeeded`);
	} else if (expectedMessage) {
		// check error message
		assert.equal(response.body?.error?.message, expectedMessage);
		logger.debug(
			`⚠️ login failed as expected with message "${expectedMessage}"`
		);
	} else {
		logger.debug(`⚠️ login failed as expected`);
	}

	return response;
}

/**
 * Runs tests for POST /login endpoint.
 * @returns {Promise<void>}
 */
export async function testLoginPostRoutes(): Promise<void> {
	const testCases = [
		{
			desc: "400 for wrong credentials",
			credentials: loginIncorrect,
			message: "Wrong Credentials",
			status: 400,
		},
		{
			desc: "200 and return a valid token",
			credentials: loginCorrect,
			message: undefined,
			status: 200,
		},
	];

	for (let i = 0; i < testCases.length; i++) {
		const tc = testCases[i];
		const label = `TEST ${i + 1}: POST /login → should return ${tc.desc}`;
		test(label, async () => {
			const res = await testPostLogin(
				tc.credentials,
				tc.status,
				tc.message
			);

			// Additional assertions
			if (tc.status === 400) {
				assert.ok(res.body.error);
				assert.equal(res.body.error.message, tc.message);
			}
			if (tc.status === 200) {
				assert.ok(!res.error);

				const { accessToken, user } = res.body;
				assert.ok(
					accessToken && accessToken.length > 10,
					"Token should be valid"
				);
				assert.equal(user.email, loginCorrect.email);
				assert.equal(user.role, "USER");
			}
		});
	}
}
