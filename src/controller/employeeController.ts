// src/controller/employeeController.ts

import { Request, Response, NextFunction } from "express";
import { employeesService } from "../service/employee/EmployeesServiceMap.ts";
import { Employee } from "../model/dtoTypes/Employee.ts";
import logger from "../utils/logger.ts";

const logPrefix = "[EmployeeController]";
const messages = {
	getAll: {
		start: `${logPrefix} ℹ️  Fetching all employees`,
		success: (emplNum) => `${logPrefix} ✅  Found ${emplNum} employees`,
	},
	create: {
		start: `${logPrefix} ℹ️  Creating employee`,
		success: (id) => `${logPrefix} ✅  Employee created with id: ${id}`,
	},
	update: {
		start: `${logPrefix} ℹ️  Updating employee`,
		success: (id) => `${logPrefix} ✅  Employee updated: ${id}`,
	},
	delete: {
		start: `${logPrefix} ℹ️  Deleting employee`,
		success: (id) => `${logPrefix} ✅  Employee deleted: ${id}`,
	},
};

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
	logger.debug(messages.getAll.start, { department });
	const employees: Employee[] = employeesService.getAll(department);
	logger.info(messages.getAll.success(employees.length));
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
	logger.debug(messages.create.start, {
		fullName: newEmployee.fullName,
		department: newEmployee.department,
	});
	const addedEmployee: Employee = employeesService.addEmployee(newEmployee);
	logger.info(messages.create.success(addedEmployee.id));
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
	logger.debug(messages.update.start, { id, updates: req.body });
	const updated: Employee | null = employeesService.updateEmployee(
		id,
		req.body as Partial<Employee>
	);
	logger.info(messages.update.success(updated?.id));
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
	logger.debug(messages.delete.start, { id });
	const deleted: Employee | null = employeesService.deleteEmployee(id);
	logger.info(messages.delete.success(deleted?.id));
	res.status(200).json(deleted);
}

// Exporting the controller functions
export { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };
