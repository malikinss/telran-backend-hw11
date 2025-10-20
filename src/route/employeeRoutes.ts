// src/route/employeeRoutes.ts

import express, { RequestHandler } from "express";
import { auth } from "../middleware/auth/auth.ts";
import validation from "../middleware/validations/validateEmployee.ts";
import {
	employeeSchema,
	employeeSchemaPartial,
} from "../middleware/validations/schemas/employeeSchema.ts";
import {
	getAllEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
} from "../controller/employeeController.ts";

const router = express.Router();

// Middleware for authorization
const allAuth: RequestHandler = auth(["USER", "ADMIN"]);
const adminAuth: RequestHandler = auth(["ADMIN"]);

/**
 * GET /api/employees
 * Returns all employees.
 * Access: USER, ADMIN
 */
router.get("/", allAuth, getAllEmployees);

/**
 * POST /api/employees
 * Creates a new employee.
 * Access: ADMIN only
 */
router.post("/", adminAuth, validation(employeeSchema), createEmployee);

/**
 * PATCH /api/employees/:id
 * Updates an existing employee partially.
 * Access: ADMIN only
 */
router.patch(
	"/:id",
	adminAuth,
	validation(employeeSchemaPartial),
	updateEmployee
);

/**
 * DELETE /api/employees/:id
 * Deletes an employee by ID.
 * Access: ADMIN only
 */
router.delete("/:id", adminAuth, deleteEmployee);

export default router;
