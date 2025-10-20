// src/service/employee/EmployeesServiceMap.ts

import { v4 as uuidv4 } from "uuid";
import { Employee } from "../../model/dtoTypes/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import { fileStorage } from "../../utils/fileStorage.ts";
import {
	AlreadyExistsError,
	NotFoundError,
} from "../../model/errorTypes/employeeErrors.ts";

/**
 * In-memory implementation of EmployeesService using a Map.
 * Provides methods to add, get, update, and delete employees.
 * Loads initial data from file storage.
 * @implements EmployeesService
 */
class EmployeesServiceMap implements EmployeesService {
	private _employees: Map<string, Employee> = new Map();
	private _isUpdated: boolean;

	constructor(isUpdated = false) {
		this._isUpdated = isUpdated;
		this._loadFromFile();
	}

	/**
	 * Loads employees from file storage into the internal Map.
	 * @private
	 */
	private _loadFromFile(): void {
		const loaded = fileStorage.loadEmployees();
		this._fillEmployeeMap(loaded);
		console.log(
			`[EmployeesService] Loaded ${this._employees.size} employees from file`
		);
	}

	/**
	 * Populates the internal Map with employees from an array.
	 * @param {Employee[]} employees - Array of employees to insert into the Map.
	 * @private
	 */
	private _fillEmployeeMap(employees: Employee[]): void {
		this._employees.clear();
		for (const employee of employees) {
			if (employee.id) {
				this._employees.set(employee.id, employee);
			} else {
				console.warn(
					`[EmployeesService] Skipping employee without ID: ${JSON.stringify(
						employee
					)}`
				);
			}
		}
	}

	/**
	 * Adds a new employee to the in-memory store.
	 * @param {Employee} empl - Employee object to add.
	 * @returns {Employee} The added employee object.
	 * @throws {AlreadyExistsError} If employee with same ID already exists.
	 */
	addEmployee(empl: Employee): Employee {
		const id: string = empl.id ?? uuidv4();
		if (this._employees.has(id)) {
			throw new AlreadyExistsError(id);
		}
		empl.id = id;
		this._employees.set(id, empl);
		this._isUpdated = true;
		return empl;
	}

	/**
	 * Retrieves all employees, optionally filtered by department.
	 * @param {string} [department] - Optional department to filter by.
	 * @returns {Employee[]} Array of Employee objects.
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
	 * @param {string} id - ID of the employee to update.
	 * @param {Partial<Employee>} empl - Partial employee object with updated fields.
	 * @returns {Employee} The updated employee object.
	 */
	updateEmployee(id: string, empl: Partial<Employee>): Employee {
		const existing = this._getById(id);
		Object.assign(existing, empl);
		this._isUpdated = true;
		return existing;
	}

	/**
	 * Deletes an employee by ID.
	 * @param {string} id - ID of the employee to delete.
	 * @returns {Employee} The deleted employee object.
	 */
	deleteEmployee(id: string): Employee {
		const existing = this._getById(id);
		this._employees.delete(id);
		this._isUpdated = true;
		return existing;
	}

	/**
	 * Retrieves an employee by ID, throwing NotFoundError if not found.
	 * @param {string} id - ID of the employee to retrieve.
	 * @returns {Employee} The Employee object.
	 * @throws {NotFoundError} If the employee does not exist.
	 * @private
	 */
	private _getById(id: string): Employee {
		const existing = this._employees.get(id);
		if (!existing) {
			throw new NotFoundError(id);
		}
		return existing;
	}

	/**
	 * Converts the in-memory employees to an array.
	 * @returns {Employee[]} Array of Employee objects.
	 * @example
	 * const employeesArray = employeesService.toArray();
	 */
	toArray(): Employee[] {
		return Array.from(this._employees.values());
	}

	/**
	 * Returns whether the in-memory store has unsaved changes.
	 * @returns {boolean} True if employees have been added/updated/deleted since last save.
	 */
	isUpdated(): boolean {
		return this._isUpdated;
	}
}

export const employeesService = new EmployeesServiceMap();
