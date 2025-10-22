// src/__tests__/employeeRoutesTests/employeePostRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import { app } from "../allRoutes.test.ts";

/**
 * Helper to test POST /employees endpoint.
 *
 * @param {string} label - Description of the test (e.g. "POST /employees → should return 403 for USER role")
 * @param {string | undefined} authHeader - Authorization header (optional)
 * @param {object} employeeData - Employee payload to send
 * @param {number} expectedStatus - Expected HTTP status code
 * @returns {Promise<supertest.Response>} - Response object
 */
export async function testPostEmployee(
	label: string,
	authHeader: string | undefined,
	employeeData: object,
	expectedStatus: number
) {
	console.log(`🧪 ${label}`);

	const request = supertest(app).post("/employees").send(employeeData);
	if (authHeader) request.set("Authorization", authHeader);

	const response = await request;
	console.log(`🔸 Status: ${response.statusCode}`);

	assert.equal(
		response.statusCode,
		expectedStatus,
		`Expected status ${expectedStatus}, got ${response.statusCode}`
	);

	if (expectedStatus === 200) {
		assert.ok(response.body, "Expected a response body");
		assert.ok(!response.error, "Unexpected error in response");
		console.log(`✅ ${label} → employee created successfully`);
	} else {
		console.log(`⚠️ ${label} → expected failure handled`);
	}

	return response;
}
