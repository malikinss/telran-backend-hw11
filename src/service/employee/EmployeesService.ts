// src/service/employee/EmployeesService.ts

import { Employee } from "../../model/dtoTypes/Employee.ts";

/**
 * Service interface for managing employees.
 * Provides methods to get, add, update, and delete employees.
 * @interface EmployeesService
 * @method getAll - Retrieves all employees, optionally filtered by department.
 * @method addEmployee - Adds a new employee.
 * @method updateEmployee - Updates an existing employee by ID.
 * @method deleteEmployee - Deletes an employee by ID.
 * @returns {Employee | Employee[] | null} - Returns the employee(s) or null if not found.
 * @throws {Error} - Throws an error if the operation fails.
 * @example
 * const service: EmployeesService = ...;
 * const allEmployees = service.getAll();
 * const newEmployee = service.addEmployee({ name: "John Doe", department: "HR" });
 * const updatedEmployee = service.updateEmployee("123", { department: "Finance" });
 * const deletedEmployee = service.deleteEmployee("123");
 */
export default interface EmployeesService {
	/** Retrieves all employees, optionally filtered by department.
	 * @param {string} [department] - Optional department to filter employees.
	 * @returns {Employee[]} - Array of employees.
	 */
	getAll(department?: string): Employee[];

	/** Adds a new employee.
	 * @param {Employee} empl - Employee object to add.
	 * @returns {Employee} - The added employee with assigned ID.
	 */
	addEmployee(empl: Employee): Employee;

	/** Updates an existing employee by ID.
	 * @param {string} id - ID of the employee to update.
	 * @param {Partial<Employee>} empl - Partial employee object with fields to update.
	 * @return {Employee} - The updated employee.
	 * @throws {Error} - Throws an error if the employee with the given ID does not exist.
	 */
	updateEmployee(id: string, empl: Partial<Employee>): Employee;

	/** Deletes an employee by ID.
	 * @param {string} id - ID of the employee to delete.
	 * @returns {Employee} - The deleted employee.
	 * @throws {Error} - Throws an error if the employee with the given ID does not exist.
	 */
	deleteEmployee(id: string): Employee;
}
