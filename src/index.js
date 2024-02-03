import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import database from './config/database.js';
import UsersRouter from './routers/UsersRouter.js';
import ProductsRouter from './routers/ProductsRouter.js';
import logger from './config/logger.js';
import logsMeta from './middlewares/logsMeta.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logsMeta);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	logger.info('route accessed...', { meta: req.logMeta });
	next();
});

app.use(UsersRouter);
app.use(ProductsRouter);

app.use((err, req, res, next) => {
	logger.error(err.stack, { meta: req.logMeta });
	res.status(err.status || 500).json({ error: err.message });
});

database()
	.then(() => console.log(`database connected ${process.env.DB_URI}`))
	.catch(err => console.log('database not connect !'));

app.listen(process.env.APP_PORT, () =>
	console.log(`server running on port ${process.env.APP_PORT}`)
);
