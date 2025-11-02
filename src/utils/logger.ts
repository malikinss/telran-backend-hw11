// src/utils/logger.ts
import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

winston.addColors({
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "blue",
});

/**
 * Get log level based on environment.
 * @returns {string} Log level
 */
const getLogLevel = (): string => {
	const env = process.env.NODE_ENV ?? "development";
	return env === "development" ? "debug" : "info";
};

/**
 * Log format configuration.
 */
const logFormat = combine(
	colorize({ all: true }),
	timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	printf(
		({ timestamp, level, message }) =>
			`[${timestamp}] ${level}: ${message}`
	)
);

/**
 * Transports configuration based on environment.
 * @type {winston.transport[]}
 */
const transports: winston.transport[] =
	process.env.NODE_ENV === "test"
		? [
				new winston.transports.Stream({
					stream: process.stdout,
					silent: true, // logs will not be output
				}),
		  ]
		: [new winston.transports.Console()];

/**
 * Winston Logger instance.
 * @type {winston.Logger}
 */
const logger: winston.Logger = winston.createLogger({
	level: getLogLevel(),
	levels,
	format: logFormat,
	transports,
});

export default logger;
