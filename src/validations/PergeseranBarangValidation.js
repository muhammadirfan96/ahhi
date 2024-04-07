import { body, param, query } from 'express-validator';
import PergeseranBarangModel from '../models/PergeseranBarangModel.js';
import runValidation from '../middlewares/runValidation.js';

const showPergeseranBarangValidation = [
  param('id')
    .isMongoId()
    .withMessage('invalid ID')
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter;
        if (req.role === 'admin') {
          filter = { _id: value };
        } else if (req.role === 'user') {
          filter = { _id: value, createdBy: req.uid };
        } else {
          throw new Error('role not allowed');
        }

        const data = await PergeseranBarangModel.findOne(filter);
        if (!data) throw new Error('data not found');
        req.data = data;
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    })
    .bail({ level: 'request' }),
  runValidation
];

const findPergeseranBarangValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit min: 1 and max: 100'),
  query('page').optional().isInt().withMessage('page must integer'),
  runValidation
];

export { showPergeseranBarangValidation, findPergeseranBarangValidation };
