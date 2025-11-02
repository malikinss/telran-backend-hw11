// src/__tests__/employeeRoutesTests/employeePatchRoutes.test.ts

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
 * Generic helper to test PATCH /employees/:id endpoint.
 * @param {string} id - Employee ID
 * @param {object} payload - Body data for update
 * @param {number} expectedStatus - Expected status code
 * @param {string} [authHeader] - Optional authorization header
 * @returns {Promise<supertest.Response>} - HTTP response
 */
async function testPatchEmployee(
	id: string,
	payload: object,
	expectedStatus: number,
	authHeader?: string
) {
	let request = supertest(app).patch(`/employees/${id}`).send(payload);

	if (authHeader) request = request.set("Authorization", authHeader);

	const response = await request;
	logger.debug(`🔸 Response: ${response.statusCode}`);

	assert.equal(response.statusCode, expectedStatus);

	if (expectedStatus === 200) {
		logger.debug(`✅ employee updated successfully`);
	} else {
		logger.debug(`⚠️ received expected status ${expectedStatus}`);
	}

	return response;
}

/**
 * Runs tests for PATCH /employees/:id endpoint.
 * @returns {Promise<void>}
 */
export async function testEmployeePatchRoutes(): Promise<void> {
	const id = validEmployee.id as string;
	const lowSalary = { salary: 2000 };
	const normalSalary = { salary: 5001 };
	const highSalary = { salary: 20000 };

	const testCases = [
		{
			desc: "401 when no token is provided",
			id,
			auth: undefined,
			status: 401,
			payload: highSalary,
		},
		{
			desc: "403 when user lacks permission",
			id,
			auth: userAuthHeader,
			status: 403,
			payload: highSalary,
		},
		{
			desc: "400 when validation fails",
			id,
			auth: adminAuthHeader,
			status: 400,
			payload: lowSalary,
		},
		{
			desc: "200 for valid admin update",
			id,
			auth: adminAuthHeader,
			status: 200,
			payload: normalSalary,
		},
	];

	for (let i = 0; i < testCases.length; i++) {
		const tc = testCases[i];
		const label = `TEST ${i + 1}: PATCH /employees/:id → should return ${
			tc.desc
		}`;
		test(label, async () => {
			const res = await testPatchEmployee(
				tc.id,
				tc.payload,
				tc.status,
				tc.auth
			);

			if (tc.status === 400) {
				assert.ok(res.text.includes("salary"));
			}
			if (tc.status === 200) {
				assert.ok(!res.error);
			}
		});
	}
}
