// src/controller/employeeController.ts

import { Request, Response, NextFunction } from "express";
import { employeesService } from "../service/employee/EmployeesServiceMap.ts";
import { Employee } from "../model/dtoTypes/Employee.ts";

/**
 * Get all employees
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @return void
 * @example
 * GET /api/employees
 * GET /api/employees?department=Sales
 * @throws {Error} - If an error occurs while fetching employees
 * @description
 * This function handles the GET request to fetch all employees.
 * It can optionally filter employees by department if the 'department' query parameter is provided.
 * The response is sent with a 200 status code and a JSON array of employees.
 * If an error occurs, it is passed to the next middleware for handling.
 */
function getAllEmployees(req: Request, res: Response, _: NextFunction) {
	console.log("GET ALL EMPL");
	const department =
		typeof req.query.department === "string"
			? req.query.department
			: undefined;
	const employees: Employee[] = employeesService.getAll(department);
	res.status(200).json(employees);
}

/**
 * Create a new employee
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @return void
 * @example
 * POST /api/employees
 * Body: { "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Sales", "birthDate": "1990-01-01", "salary": 50000 }
 * @throws {z.ZodError} - If the request body does not match the employee schema
 * @throws {AlreadyExistsError} - If an employee with the same ID already exists
 * @description
 * This function handles the POST request to create a new employee.
 * It validates the request body against the employee schema using Zod.
 * If validation passes, it adds the new employee to the in-memory store and responds with a 201 status code and the created employee object.
 * If validation fails or if an employee with the same ID already exists, the error is passed to the next middleware for handling.
 */
function createEmployee(req: Request, res: Response, _: NextFunction) {
	const newEmployee: Employee = req.body as Employee;
	const addedEmployee: Employee = employeesService.addEmployee(newEmployee);
	res.status(201).json(addedEmployee);
}

/**
 * Update an existing employee
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @return void
 * @example
 * PUT /api/employees/:id
 * Body: { "fullName": "Jane Doe" }
 * @throws {NotFoundError} - If the employee with the specified ID is not found
 * @description
 * This function handles the PUT request to update an existing employee.
 * It validates the request body against the employee schema using Zod.
 * If validation passes, it updates the employee in the in-memory store and responds with a 200 status code and the updated employee object.
 * If validation fails or if the employee with the specified ID is not found, the error is passed to the next middleware for handling.
 */
function updateEmployee(req: Request, res: Response, _: NextFunction) {
	const id: string = req.params.id;
	const updated: Employee | null = employeesService.updateEmployee(
		id,
		req.body as Partial<Employee>
	);
	res.status(200).json(updated);
}

/**
 * Delete an employee
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @return void
 * @example
 * DELETE /api/employees/:id
 * @throws {NotFoundError} - If the employee with the specified ID is not found
 * @description
 * This function handles the DELETE request to remove an employee.
 * It deletes the employee from the in-memory store and responds with a 200 status code and the deleted employee object.
 * If the employee with the specified ID is not found, the error is passed to the next middleware for handling.
 */
function deleteEmployee(req: Request, res: Response, _: NextFunction) {
	const id: string = req.params.id;
	const deleted: Employee | null = employeesService.deleteEmployee(id);
	res.status(200).json(deleted);
}

// Exporting the controller functions
export { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };
