// src/__tests__/employeeRoutesTests/employeePatchRoutes.test.ts

import supertest from "supertest";
import assert from "assert/strict";
import { app } from "../allRoutes.test.ts";

/**
 * Generic helper to test PATCH /employees/:id
 *
 * @param {string} label - Description for logging (e.g. "PATCH /employees/123 → should return 200 for ADMIN role")
 * @param {string} id - Employee ID
 * @param {object} payload - Body data for update
 * @param {number} expectedStatus - Expected status code
 * @param {string} [authHeader] - Optional authorization header
 * @returns {Promise<supertest.Response>} - HTTP response
 */
export async function testPatchEmployee(
	label: string,
	id: string,
	payload: object,
	expectedStatus: number,
	authHeader?: string
) {
	console.log(`🧪 ${label}`);
	let request = supertest(app).patch(`/employees/${id}`).send(payload);

	if (authHeader) request = request.set("Authorization", authHeader);

	const response = await request;
	console.log(`🔸 Response: ${response.statusCode}`);

	assert.equal(response.statusCode, expectedStatus);

	if (expectedStatus === 200) {
		console.log(`✅ ${label}: employee updated successfully`);
	} else {
		console.log(`⚠️ ${label}: received expected status ${expectedStatus}`);
	}

	return response;
}
