import winston from 'winston';
import 'winston-mongodb';
import { uri } from './database.js';
import dotenv from 'dotenv';
dotenv.config();

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.MongoDB({
			level: 'info',
			db: uri,
			collection: 'combined-logs',
			options: { useUnifiedTopology: true },
			metaKey: 'meta'
		})
	],
	exceptionHandlers: [
		new winston.transports.File({ filename: 'logs/exceptions.log' })
	],
	rejectionHandlers: [
		new winston.transports.File({ filename: 'logs/rejections.log' })
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console());
}

export default logger;
