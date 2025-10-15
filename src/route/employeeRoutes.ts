// src/route/employeeRoutes.ts

import express from "express";
import {
	getAllEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
} from "../controller/employeeController.ts";
import validation from "../middleware/validations/validateEmployee.ts";
import employeeSchema from "../middleware/validations/schemas/employeeSchema.ts";
import { auth, authenticate } from "../middleware/auth/auth.ts";

const router = express.Router();

// GET /api/employees - Get all employees, allowed for ADMIN and USER
router.get("/", authenticate, auth(["ADMIN", "USER"]), getAllEmployees);

// POST /api/employees - Create a new employee, allowed only for ADMIN
router.post(
	"/",
	authenticate,
	auth(["ADMIN"]),
	validation(employeeSchema),
	createEmployee
);

// PATCH /api/employees/:id - Update an existing employee, allowed only for ADMIN
router.patch(
	"/:id",
	authenticate,
	auth(["ADMIN"]),
	validation(employeeSchema.partial()),
	updateEmployee
);

// DELETE /api/employees/:id - Delete an employee, allowed only for ADMIN
router.delete("/:id", authenticate, auth(["ADMIN"]), deleteEmployee);

export default router;
