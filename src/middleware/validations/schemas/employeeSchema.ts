// src/middleware/validations/schemas/employeeSchema.ts

import z from "zod";
import {
	getDepartments,
	getMaxDate,
	getMinDate,
	getMaxSalary,
	getMinSalary,
} from "../../../utils/configFuncs.ts";

const deps: Set<string> = new Set(getDepartments());
const minSalary = getMinSalary();
const maxSalary = getMaxSalary();
const minDate = getMinDate();
const maxDate = getMaxDate();

const messages = {
	minSalary: `Salary must be greater than ${minSalary}`,
	maxSalary: `Salary must be less than ${maxSalary}`,
	name: "Full Name must be at least 2 characters long",
	avatar: "Avatar must be a valid URL",
	department: `Department must be one of: ${Array.from(deps.values()).join(
		", "
	)}`,
	birthDate: `Birth date must be between ${minDate} and ${maxDate} (ISO format)`,
};

/**
 * Zod schema for validating employee data.
 * Ensures that all employee fields conform to the required format and constraints.
 *
 * @property {string} [id] - Optional UUID of the employee.
 * @property {string} fullName - Full name, must contain at least 2 characters.
 * @property {string} avatar - URL to employee’s avatar image.
 * @property {string} department - Must be one of the allowed departments.
 * @property {string} birthDate - ISO date string within allowed range.
 * @property {number} salary - Integer between configured minimum and maximum salary.
 *
 * @example
 * const data = {
 *   fullName: "Alice Johnson",
 *   avatar: "https://example.com/avatar.jpg",
 *   department: "QA",
 *   birthDate: "1995-05-20",
 *   salary: 12000
 * };
 *
 * const parsed = employeeSchema.parse(data);
 * // Returns validated employee object or throws ZodError if invalid.
 */
export const employeeSchema = z.object({
	id: z.uuid().optional(),
	fullName: z.string().min(2, { message: messages.name }),
	avatar: z.url({ message: messages.avatar }),
	department: z
		.string()
		.refine((dep) => deps.has(dep), { message: messages.department }),
	birthDate: z
		.string()
		.transform((val) => new Date(val))
		.refine(
			(date) => date >= new Date(minDate) && date <= new Date(maxDate),
			{ message: messages.birthDate }
		),
	salary: z
		.number()
		.int()
		.min(minSalary, { message: messages.minSalary })
		.max(maxSalary, { message: messages.maxSalary }),
});

export const employeeSchemaPartial = employeeSchema.partial();
