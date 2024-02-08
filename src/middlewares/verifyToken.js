import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError.js';
import { accessTokenKey } from '../config/jwt.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return new CustomError(401, 'unauthorized');
    jwt.verify(token, accessTokenKey, (err, decoded) => {
        if (err) return next(new CustomError(403, 'forbidden'));
        req.uid = decoded.id;
    });
    next();
};

export default verifyToken;
