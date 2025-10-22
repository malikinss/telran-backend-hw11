// src/__tests__/testData/employeeTestData.test.ts

import { Employee } from "../../model/dtoTypes/Employee.ts";

/**
 * ✅ Valid employee data (should pass validation)
 */
const validEmployee: Employee = {
	avatar: "https://example.com/avatar.png",
	birthDate: "2000-01-01",
	department: "QA",
	fullName: "Vasya Ivanov",
	salary: 10000,
};

/**
 * ❌ Invalid employee data (should fail validation)
 */
const invalidEmployee: Employee = {
	avatar: "kuku", // should be a valid URL
	birthDate: "1900-01-01", // unrealistic date (too old)
	department: "Q", // too short
	fullName: "", // required field missing
	salary: 1000, // too low
};

/**
 * Dynamically extract all employee field names.
 */
const employeeFields = Object.keys(validEmployee);

/**
 * Export unified test data for employee tests.
 */
export const employeeTestData = {
	validEmployee,
	invalidEmployee,
	fields: employeeFields,
};
