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

const level = (): string => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "debug" : "error";
};

const logFormat = combine(
	colorize({ all: true }),
	timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	printf(
		({ timestamp, level, message }) =>
			`[${timestamp}] ${level}: ${message}`
	)
);

const transports = [new winston.transports.Console()];
const logOptions = {
	level: level(),
	levels,
	format: logFormat,
	transports,
};

const logger = winston.createLogger(logOptions);

export default logger;
