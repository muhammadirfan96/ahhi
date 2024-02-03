import { validationResult } from 'express-validator';
import CustomError from '../utils/CustomError.js';

const runValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = errors.array().map(error => error.msg);
		return next(new CustomError(400, err));
	}
	next();
};

export default runValidation;
