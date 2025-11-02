// src/__tests__/employeeRoutesTests/employeePostRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import test from "node:test";
import { app } from "../allRoutes.test.ts";
import logger from "../../utils/logger.ts";

import {
	employeeTestData,
	adminTestData,
	userTestData,
} from "../testData/index.ts";

const { adminAuthHeader } = adminTestData;
const { userAuthHeader } = userTestData;

const { validEmployee, invalidEmployee, fields } = employeeTestData;

/**
 * Helper to test POST /employees endpoint.
 *
 * @param {string | undefined} authHeader - Authorization header (optional)
 * @param {object} employeeData - Employee data to send in the request body
 * @param {number} expectedStatus - Expected HTTP status code
 * @returns {Promise<supertest.Response>}
 */
async function testPostEmployee(
	authHeader: string | undefined,
	employeeData: object,
	expectedStatus: number
): Promise<supertest.Response> {
	const request = supertest(app).post("/employees").send(employeeData);
	if (authHeader) request.set("Authorization", authHeader);

	const response = await request;
	logger.debug(`🔸 Status: ${response.statusCode}`);

	assert.equal(
		response.statusCode,
		expectedStatus,
		`Expected status ${expectedStatus}, got ${response.statusCode}`
	);

	if (expectedStatus === 200) {
		assert.ok(response.body, "Expected a response body");
		assert.ok(!response.error, "Unexpected error in response");
		logger.debug(`✅ → employee created successfully`);
	} else {
		logger.debug(`⚠️ → expected failure handled`);
	}

	return response;
}

/**
 * Runs tests for POST /employees endpoint.
 * @returns {Promise<void>}
 */
export async function testEmployeePostRoutes(): Promise<void> {
	const testCases = [
		{
			desc: "401 without token",
			auth: null,
			employee: validEmployee,
			status: 401,
		},
		{
			desc: "403 for USER role",
			auth: userAuthHeader,
			employee: validEmployee,
			status: 403,
		},
		{
			desc: "400 for ADMIN role with invalid data",
			auth: adminAuthHeader,
			employee: invalidEmployee,
			status: 400,
		},
		{
			desc: "201 for ADMIN role with valid data",
			auth: adminAuthHeader,
			employee: validEmployee,
			status: 201,
		},
	];

	for (let i = 0; i < testCases.length; i++) {
		const tc = testCases[i];
		const label = `TEST ${i + 1}: POST /employees → should return ${
			tc.desc
		}`;
		test(label, async () => {
			const res = await testPostEmployee(
				tc.auth,
				tc.employee,
				tc.status
			);

			// Additional assertions based on expected status
			if (tc.status === 400) {
				assert.ok(fields.every((f) => res.text.includes(f)));
			}
			if (tc.status === 201) {
				assert.ok(res.body, "Expected response body");
				assert.ok(!res.error, "Unexpected error in response");
			}
		});
	}
}
