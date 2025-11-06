const pino = require('pino');

const level = process.env.LOG_LEVEL || 'info';

const logger = pino({ level });

module.exports = logger;
