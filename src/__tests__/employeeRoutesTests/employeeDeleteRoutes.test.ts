// src/__tests__/employeeRoutesTests/employeeDeleteRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import { app } from "../allRoutes.test.ts";

/**
 * Generic helper to test DELETE /employees/:id
 *
 * @param {string} label - Description for logging (e.g. "DELETE /employees/123 → should return 200 for ADMIN role")
 * @param {string} id - Employee ID to delete
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {string} [authHeader] - Optional authorization header
 * @returns {Promise<supertest.Response>} - HTTP response
 */
export async function testDeleteEmployee(
	label: string,
	id: string,
	expectedStatus: number,
	authHeader?: string
) {
	console.log(`🧪 ${label}`);
	let request = supertest(app).delete(`/employees/${id}`);

	if (authHeader) request = request.set("Authorization", authHeader);

	const response = await request;
	console.log(`🔸 Response: ${response.statusCode}`);

	assert.equal(response.statusCode, expectedStatus);

	if (expectedStatus === 200) {
		console.log(`✅ ${label}: employee deleted successfully`);
	} else {
		console.log(`⚠️ ${label}: received expected status ${expectedStatus}`);
	}

	return response;
}
