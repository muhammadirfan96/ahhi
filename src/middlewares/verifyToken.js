import jwt from 'jsonwebtoken';
import UsersModel from '../models/UsersModel.js';
import CustomError from '../utils/CustomError.js';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (!token) {
			throw new CustomError(401, 'unauthorized');
		}
		jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
			if (err) throw new CustomError(403, 'forbidden');

			const user = UsersModel.findOne({
				email: decoded.email,
				active: 1
			});

			if (!user) throw new CustomError(403, 'forbidden');
			
			req.me = user;
		});
		next();
	} catch (e) {
		next(e);
	}
};

export default verifyToken;
