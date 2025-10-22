// src/__tests__/employeeRoutesTests/employeeGetRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import { app } from "../allRoutes.test.ts";

/**
 * Helper to test GET /employees endpoint.
 *
 * @param {string} label - Description of the test (e.g., "GET /employees → should return 200 for ADMIN role")
 * @param {string | undefined} authHeader - Authorization header (optional)
 * @param {number} expectedStatus - Expected HTTP status code
 * @returns {Promise<void>}
 */
export async function testGetEmployees(
	label: string,
	authHeader: string | undefined,
	expectedStatus: number
): Promise<void> {
	console.log(`🧪 ${label}`);
	const request = supertest(app).get("/employees");

	if (authHeader) request.set("Authorization", authHeader);

	const response = await request;
	console.log(`🔸 Status: ${response.statusCode}`);

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
		console.log(
			`✅ ${label} → received ${response.body.length} employees`
		);
	} else {
		console.log(`⚠️ ${label} → no data expected`);
	}
}
