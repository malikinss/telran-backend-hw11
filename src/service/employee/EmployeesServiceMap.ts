// src/service/employee/EmployeesServiceMap.ts

import { v4 as uuidv4 } from "uuid";
import { Employee } from "../../model/dtoTypes/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import { fileStorage } from "../../utils/fileStorage.ts";
import { AlreadyExistsError } from "../../model/errorTypes/employeeErrors.ts";
import { NotFoundError } from "../../model/errorTypes/employeeErrors.ts";

/**
 * In-memory implementation of EmployeesService using a Map.
 * Provides methods to add, get, update, and delete employees.
 * @implements EmployeesService
 */
class EmployeesServiceMap implements EmployeesService {
	private _employees: Map<string, Employee> = new Map();

	constructor() {
		const loaded = fileStorage.loadEmployees();
		loaded.forEach((empl) => this._employees.set(empl.id!, empl));
		console.log(
			`[EmployeesService] Loaded ${this._employees.size} employees from file`
		);
	}
	/**
	 * Adds a new employee to the in-memory store.
	 * @param empl - Employee object to be added
	 * @returns The added employee object
	 */
	addEmployee(empl: Employee): Employee {
		const id: string = empl.id ?? uuidv4();
		if (this._employees.has(id)) {
			throw new AlreadyExistsError(id);
		}
		empl.id = id;
		this._employees.set(id, empl);
		return empl;
	}

	/**
	 * Retrieves all employees, optionally filtered by department.
	 * @param department - Optional department to filter employees
	 * @returns Array of Employee objects
	 */
	getAll(department?: string): Employee[] {
		let all: Employee[] = Array.from(this._employees.values());
		if (department) {
			all = all.filter((empl) => empl.department === department);
		}
		return all;
	}

	/**
	 * Updates an existing employee's details.
	 * @param id - ID of the employee to be updated
	 * @param empl - Partial Employee object with updated fields
	 * @returns The updated Employee object
	 */
	updateEmployee(id: string, empl: Partial<Employee>): Employee {
		const existing = this._getById(id);
		Object.assign(existing, empl);
		return existing;
	}

	/**
	 * Deletes an employee by ID.
	 * @param id - ID of the employee to be deleted
	 * @returns The deleted Employee object
	 */
	deleteEmployee(id: string): Employee {
		const existing = this._getById(id);
		this._employees.delete(id);
		return existing;
	}

	/**
	 * Retrieves an employee by ID, throwing NotFoundError if not found.
	 * @param id - ID of the employee to retrieve
	 * @returns The Employee object
	 * @throws NotFoundError if the employee does not exist
	 * @private
	 */
	private _getById(id: string): Employee {
		const existing: Employee | undefined = this._employees.get(id);
		if (!existing) {
			throw new NotFoundError(id);
		}
		return existing;
	}

	/**
	 * Converts the in-memory employees to an array.
	 * @returns Array of Employee objects
	 * @example
	 * const employeesArray = employeesService.toArray();
	 * console.log(employeesArray);
	 * // Outputs an array of all employees
	 */
	toArray(): Employee[] {
		return Array.from(this._employees.values());
	}
}

export const employeesService = new EmployeesServiceMap();
