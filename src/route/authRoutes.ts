// src/route/authRoutes.ts

import express from "express";
import { login } from "../controller/accountingController.ts";

const router = express.Router();

/**
 * @route POST /login
 * @desc Authenticate user and return JWT token
 * @access Public
 */
router.post("/", login);

export default router;
