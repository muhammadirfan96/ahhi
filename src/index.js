import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import UsersRouter from './routers/UsersRouter.js';
import ProductsRouter from './routers/ProductsRouter.js';
import logsMeta from './middlewares/logsMeta.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { port } from './config/app.js';
import logger from './config/logger.js';
import database, { uri } from './config/database.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logsMeta);

app.use((req, res, next) => {
    req.logMeta.userId = req.uid;
    logger.info('route accessed...', { meta: req.logMeta });
    next();
});

app.use(UsersRouter);
app.use(ProductsRouter);

// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/public', express.static('public'));

app.use((err, req, res, next) => {
    logger.error(err.stack, { meta: req.logMeta });
    res.status(err.status || 500).json({ error: err.message });
});

database()
    .then(() => console.log(`database connected ${uri}`))
    .catch(err => console.log('database not connect !'));

app.listen(port, () => console.log(`server running on port ${port}`));
