import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import swaggerOptions from './swaggerOptions.js';
const specs = swaggerJsdoc(swaggerOptions);
const yamlSpecs = JSON.stringify(specs, null, 2);

fs.writeFileSync('./documentation/swagger.yaml', yamlSpecs);

console.log('File swagger.yaml berhasil di-generate');
