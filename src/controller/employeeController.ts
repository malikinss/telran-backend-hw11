// src/controller/employeeController.ts

import { Request, Response, NextFunction } from "express";
import { employeesService } from "../service/employee/EmployeesServiceMap.ts";
import { Employee } from "../model/dtoTypes/Employee.ts";

const logPrefix = "[EmployeeController]";

/**
 * Get all employees, optionally filtered by department.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns void
 * @example
 * GET /api/employees
 * GET /api/employees?department=Sales
 * @throws {Error} - If an error occurs while fetching employees
 */
function getAllEmployees(req: Request, res: Response, _: NextFunction) {
	const department =
		typeof req.query.department === "string"
			? req.query.department
			: undefined;
	console.log(`${logPrefix} Fetching all employees`, { department });
	const employees: Employee[] = employeesService.getAll(department);
	console.log(`${logPrefix} Found ${employees.length} employees`);
	res.status(200).json(employees);
}

/**
 * Create a new employee.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns void
 * @example
 * POST /api/employees
 * Body: { "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Sales", "birthDate": "1990-01-01", "salary": 50000 }
 * @throws {z.ZodError} - If the request body does not match the employee schema
 * @throws {AlreadyExistsError} - If an employee with the same ID already exists
 */
function createEmployee(req: Request, res: Response, _: NextFunction) {
	const newEmployee: Employee = req.body as Employee;
	console.log(`${logPrefix} Creating employee`, {
		fullName: newEmployee.fullName,
		department: newEmployee.department,
	});
	const addedEmployee: Employee = employeesService.addEmployee(newEmployee);
	console.log(`${logPrefix} Employee created with id: ${addedEmployee.id}`);
	res.status(201).json(addedEmployee);
}

/**
 * Update an existing employee.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns void
 * @example
 * PUT /api/employees/:id
 * Body: { "fullName": "Jane Doe" }
 * @throws {NotFoundError} - If the employee with the specified ID is not found
 */
function updateEmployee(req: Request, res: Response, _: NextFunction) {
	const id: string = req.params.id;
	console.log(`${logPrefix} Updating employee`, { id, updates: req.body });
	const updated: Employee | null = employeesService.updateEmployee(
		id,
		req.body as Partial<Employee>
	);
	console.log(`${logPrefix} Employee updated: ${updated?.id}`);
	res.status(200).json(updated);
}

/**
 * Delete an employee.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns void
 * @example
 * DELETE /api/employees/:id
 * @throws {NotFoundError} - If the employee with the specified ID is not found
 */
function deleteEmployee(req: Request, res: Response, _: NextFunction) {
	const id: string = req.params.id;
	console.log(`${logPrefix} Deleting employee`, { id });
	const deleted: Employee | null = employeesService.deleteEmployee(id);
	console.log(`${logPrefix} Employee deleted: ${deleted?.id}`);
	res.status(200).json(deleted);
}

// Exporting the controller functions
export { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };
