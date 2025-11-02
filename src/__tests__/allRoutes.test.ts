// src/__tests__/allRoutes.test.ts
import { createApp, startServer } from "../server/app.ts";
import { testEmployeeGetRoutes } from "./employeeRoutesTests/employeeGetRoutes.test.ts";
import { testEmployeePostRoutes } from "./employeeRoutesTests/employeePostRoutes.test.ts";
import { testEmployeePatchRoutes } from "./employeeRoutesTests/employeePatchRoutes.test.ts";
import { testEmployeeDeleteRoutes } from "./employeeRoutesTests/employeeDeleteRoutes.test.ts";
import { testLoginPostRoutes } from "./loginRoutesTests/loginPostRoutes.test.ts";
import logger from "../utils/logger.ts";

export const app = createApp();
startServer(app, 3800);

/**
 * Runs all route tests sequentially.
 * @returns {Promise<void>}
 */
async function runAllRouteTests() {
	await testEmployeeGetRoutes();
	await testEmployeePostRoutes();
	await testLoginPostRoutes();
	await testEmployeePatchRoutes();
	await testEmployeeDeleteRoutes();
}

runAllRouteTests().catch((error) => {
	logger.error("❌ Error running route tests:", error);
});
