'use-strict';

const winston = require('winston');
const morgan = require('morgan');

// Define different colors for each level.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ~ ${info.level}: ${info.message}`,
  ),
);

const logger = winston.createLogger({
  format,
  transports: [new winston.transports.Console()],
});

/*
 * Morgan Middleware setup
 */

const stream = {
  // Use the http severity
  write: (message) => logger.info(message),
};

morgan.token('id', (req) => req.id);

const loggingMiddlewares = [
  morgan('[:id] :method :url RESPONDED :status - :response-time ms', { stream }),
  morgan('[:id] :method :url STARTED', { stream, immediate: true }),
];

module.exports = { logger, loggingMiddlewares };
