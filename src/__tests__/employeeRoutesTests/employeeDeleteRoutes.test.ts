// src/__tests__/employeeRoutesTests/employeeDeleteRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import test from "node:test";
import { app } from "../allRoutes.test.ts";

import {
	employeeTestData,
	adminTestData,
	userTestData,
} from "../testData/index.ts";
import logger from "../../utils/logger.ts";

const { adminAuthHeader } = adminTestData;
const { userAuthHeader } = userTestData;

const { validEmployee } = employeeTestData;

/**
 * Generic helper to test DELETE /employees/:id
 * @param {string} id - Employee ID to delete
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {string} [authHeader] - Optional authorization header
 * @returns {Promise<supertest.Response>} - HTTP response
 */
async function testDeleteEmployee(
	id: string,
	expectedStatus: number,
	authHeader?: string
) {
	let request = supertest(app).delete(`/employees/${id}`);

	if (authHeader) request = request.set("Authorization", authHeader);

	const response = await request;
	logger.debug(`🔸 Response: ${response.statusCode}`);

	assert.equal(response.statusCode, expectedStatus);

	if (expectedStatus === 200) {
		logger.debug(`✅ employee deleted successfully`);
	} else {
		logger.debug(`⚠️ received expected status ${expectedStatus}`);
	}

	return response;
}

/**
 * Runs tests for DELETE /employees/:id endpoint.
 * @returns {Promise<void>}
 */
export async function testEmployeeDeleteRoutes(): Promise<void> {
	const id = validEmployee.id ?? "123"; // fallback ID if not set

	const testCases = [
		{
			desc: "401 when no token is provided",
			id,
			auth: undefined,
			status: 401,
		},
		{
			desc: "403 when user lacks permission",
			id,
			auth: userAuthHeader,
			status: 403,
		},
		{
			desc: "200 when admin deletes employee",
			id,
			auth: adminAuthHeader,
			status: 200,
		},
	];

	for (let i = 0; i < testCases.length; i++) {
		const tc = testCases[i];
		const label = `TEST ${i + 1}: DELETE /employees/:id → should return ${
			tc.desc
		}`;
		test(label, async () => {
			const res = await testDeleteEmployee(tc.id, tc.status, tc.auth);
			if (tc.status === 200) {
				assert.ok(res.body, "Expected deleted employee object");
				assert.equal(res.body.id, tc.id);
			}
		});
	}
}
