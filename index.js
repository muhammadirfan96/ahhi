import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './documentation/swaggerOptions.js';

const app = express();

dotenv.config();

const specs = swaggerJsdoc(swaggerOptions);

/**
 * @swagger
 * /example:
 *   get:
 *     description: Mendapatkan contoh data
 *     responses:
 *       200:
 *         description: OK
 */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
	console.log('server running on port 3000');
});
