// src/__tests__/employeeRoutesTests/employeeGetRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import test from "node:test";
import { app } from "../allRoutes.test.ts";
import { adminTestData, userTestData } from "../testData/index.ts";
import logger from "../../utils/logger.ts";

const { adminAuthHeader } = adminTestData;
const { userAuthHeader } = userTestData;

/**
 * Helper to test GET /employees endpoint.
 *
 * @param {string | undefined} authHeader - Authorization header (optional)
 * @param {number} expectedStatus - Expected HTTP status code
 * @returns {Promise<void>}
 */
async function testGetEmployees(
	authHeader: string | undefined,
	expectedStatus: number
): Promise<void> {
	const request = supertest(app).get("/employees");

	if (authHeader) request.set("Authorization", authHeader);

	const response = await request;
	logger.debug(`🔸 Status: ${response.statusCode}`);

	assert.equal(
		response.statusCode,
		expectedStatus,
		`Expected status ${expectedStatus}, got ${response.statusCode}`
	);

	if (expectedStatus === 200) {
		assert.ok(
			Array.isArray(response.body),
			"Expected response body to be an array"
		);
		logger.debug(`✅ received ${response.body.length} employees`);
	} else {
		logger.debug(`⚠️ no data expected`);
	}
}

/**
 * Runs tests for GET /employees endpoint.
 * @returns {Promise<void>}
 */
export async function testEmployeeGetRoutes(): Promise<void> {
	const testCases = [
		{ desc: "401 when no auth header", auth: undefined, status: 401 },
		{ desc: "200 for USER role", auth: userAuthHeader, status: 200 },
		{ desc: "200 for ADMIN role", auth: adminAuthHeader, status: 200 },
	];

	for (let i = 0; i < testCases.length; i++) {
		const tc = testCases[i];
		const label = `TEST ${i + 1}: GET /employees → should return ${
			tc.desc
		}`;
		test(label, async () => {
			await testGetEmployees(tc.auth, tc.status);
		});
	}
}
