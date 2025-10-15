// src/model/dtoTypes/Employee.ts

/**
 * Employee interface representing an employee's details.
 * @interface Employee
 * @property {string} id - Unique identifier for the employee (optional).
 * @property {string} fullName - Full name of the employee.
 * @property {string} avatar - URL to the employee's avatar image.
 * @property {string} department - Department where the employee works.
 * @property {string} birthDate - Birth date of the employee in ISO format (YYYY-MM-DD).
 * @property {number} salary - Salary of the employee.
 *
 * @example
 * const employee: Employee = {
 *   id: "123",
 *   fullName: "John Doe",
 *   avatar: "https://example.com/avatar.jpg",
 *   department: "Engineering",
 *   birthDate: "1990-01-01",
 *   salary: 60000
 * };
 */
export interface Employee {
	id?: string;
	fullName: string;
	avatar: string;
	department: string;
	birthDate: string;
	salary: number;
}
