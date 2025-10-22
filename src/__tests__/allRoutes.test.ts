// src/__tests__/allRoutes.test.ts

import test from "node:test";
import assert from "assert/strict";

import {
	employeeTestData,
	adminTestData,
	userTestData,
} from "./testData/index.ts";

import {
	testGetEmployees,
	testPostEmployee,
	testPatchEmployee,
	testDeleteEmployee,
} from "./employeeRoutesTests/index.ts";

import { testPostLogin } from "./loginRoutesTests/index.ts";
import { createApp, startServer } from "../server/app.ts";

console.log("JWT_SECRET", process.env.JWT_SECRET);
console.log("MORGAN_FORMAT", process.env.MORGAN_FORMAT);

const { adminAuthHeader } = adminTestData;
const { validEmployee, invalidEmployee, fields } = employeeTestData;
const { loginCorrect, loginIncorrect, userAuthHeader } = userTestData;

export const app = createApp();
startServer(app, 3800);

console.log("\n__________________________TESTS__________________________\n");

// --- GET /employees tests ---
let label = "TEST 1: GET /employees → should return 401 when no auth header";
test(label, async () => {
	await testGetEmployees(label, undefined, 401);
});

label = "TEST 2: GET /employees → should return 200 for USER role";
test(label, async () => {
	await testGetEmployees(label, userAuthHeader, 200);
});

label = "TEST 3: GET /employees → should return 200 for ADMIN role";
test(label, async () => {
	await testGetEmployees(label, adminAuthHeader, 200);
});

// --- POST /employees tests ---
label = "TEST 4: POST /employees → should return 401 without token";
test(label, async () => {
	await testPostEmployee(label, null, validEmployee, 401);
});

label = "TEST 5: POST /employees → should return 403 for USER role";
test(label, async () => {
	await testPostEmployee(label, userAuthHeader, validEmployee, 403);
});

label =
	"TEST 6: POST /employees → should return 400 for ADMIN role with invalid data";
test(label, async () => {
	const res = await testPostEmployee(
		label,
		adminAuthHeader,
		invalidEmployee,
		400
	);
	assert.ok(fields.every((f) => res.text.includes(f)));
});

label =
	"TEST 7: POST /employees → should return 201 for ADMIN role with valid data";
test(label, async () => {
	const res = await testPostEmployee(
		label,
		adminAuthHeader,
		validEmployee,
		201
	);
	assert.ok(res.body);
	assert.ok(!res.error);
});

// --- POST /login tests ---
label = "POST /login → should return 400 for wrong credentials";
test(label, async () => {
	const response = await testPostLogin(
		label,
		loginIncorrect,
		400,
		"Wrong Credentials"
	);
	assert.ok(response.body.error);
	assert.equal(response.body.error.message, "Wrong Credentials");
});

label = "POST /login → should return 200 and return a valid token";
test(label, async () => {
	const response = await testPostLogin(label, loginCorrect, 200);
	assert.ok(!response.error);

	const { accessToken, user } = response.body;
	assert.ok(
		accessToken && accessToken.length > 10,
		"Token should be valid and non-empty"
	);
	assert.equal(user.email, loginCorrect.email);
	assert.equal(user.id, "USER");
});

// --- PATCH /employees tests ---
const id = "33428018-69d5-4e72-807a-68fcefa69f61";
const lowSalary = { salary: 2000 };
const highSalary = { salary: 20000 };

label = "PATCH /employees/:id → should return 401 when no token is provided";
test(label, async () => {
	await testPatchEmployee(label, id, highSalary, 401);
});

label = "PATCH /employees/:id → should return 403 when user lacks permission";
test(label, async () => {
	await testPatchEmployee(label, id, highSalary, 403, userAuthHeader);
});

label = "PATCH /employees/:id → should return 400 when validation fails";
test(label, async () => {
	const res = await testPatchEmployee(
		label,
		id,
		lowSalary,
		400,
		adminAuthHeader
	);
	assert.ok(res.text.includes("salary"));
});

label = "PATCH /employees/:id → should return 200 for valid admin update";
test(label, async () => {
	const res = await testPatchEmployee(
		label,
		id,
		highSalary,
		200,
		adminAuthHeader
	);
	assert.ok(!res.error);
});

// --- DELETE /employees tests ---
label = "DELETE /employees/:id → should return 401 when no token is provided";
test(label, async () => {
	await testDeleteEmployee(label, id, 401);
});

label = "DELETE /employees/:id → should return 403 when user lacks permission";
test(label, async () => {
	await testDeleteEmployee(label, id, 403, userAuthHeader);
});

label =
	"DELETE /employees/:id → should return 200 when admin deletes employee";
test(label, async () => {
	const response = await testDeleteEmployee(label, id, 200, adminAuthHeader);
	assert.ok(!response.error);
});
