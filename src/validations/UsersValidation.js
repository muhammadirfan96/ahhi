import { body, query, param, cookie } from 'express-validator';
import UsersModel from '../models/UsersModel.js';
import runValidation from '../middlewares/runValidation.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    refreshTokenKey,
    resetPasswordTokenKey,
    activationUserTokenKey
} from '../config/jwt.js';

const showUserValidation = [
    param('id')
        .isMongoId()
        .withMessage('invalid ID')
        .bail({ level: 'request' })
        .custom(async (value, { req }) => {
            try {
                const user = await UsersModel.findById(value);
                if (!user) throw new Error('data not found');
                req.user = user;
            } catch (err) {
                throw new Error(err.message);
            }
            return true;
        }),
    runValidation
];

const findUsersValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit min: 1 and max: 100'),
    query('page').optional().isInt().withMessage('page must integer'),
    runValidation
];

const deleteUserValidation = [...showUserValidation];

const registerValidation = [
    body('email')
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail()
        .withMessage('email not valid')
        .bail({ level: 'request' })
        .custom(async (value, { req }) => {
            try {
                const user = await UsersModel.findOne({
                    email: value,
                    active: 1
                });
                if (user) throw new Error('email already used');
            } catch (err) {
                throw new Error(err.message);
            }
            return true;
        })
        .bail({ level: 'request' }),
    body('password')
        .isLength({ min: 8 })
        .withMessage('password min. 8 character')
        .bail('request')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
        .withMessage(
            'password must contain uppercase, lowercase, number, and special character'
        )
        .bail({ level: 'request' }),
    body('confPassword').custom((value, { req }) => {
        if (value !== req.body.password)
            throw new Error('corfirmation password not match');
        return true;
    }),
    runValidation
];

const activationUserValidation = [
    cookie('activationUserToken')
        .custom((value, { req }) => {
            const decode =
                value && jwt.verify(value, activationUserTokenKey);
            if (!decode) throw new Error('cookie not found');
            req.decode = decode;
            return true;
        })
        .bail({ level: 'request' }),
    param('email')
        .custom((value, { req }) => {
            if (value !== req.decode.email) throw new Error('email not match');
            req.email = value;
            return true;
        })
        .bail({ level: 'request' }),
    body('activationToken').custom(async (value, { req }) => {
        try {
            const user =
                value &&
                (await UsersModel.findOne({
                    email: req.email,
                    activationToken: value
                }));
            if (!user) throw new Error('token invalid');
            req.user = user;
        } catch (err) {
            throw new Error(err.message);
        }
        return true;
    }),
    runValidation
];

const loginValidation = [
    body('email')
        .custom(async (value, { req }) => {
            try {
                const user =
                    value &&
                    (await UsersModel.findOne({
                        email: value,
                        active: 1
                    }));
                if (!user) throw new Error('email not match');
                req.user = user;
            } catch (err) {
                throw new Error(err.message);
            }
            return true;
        })
        .bail({ level: 'request' }),
    body('password').custom(async (value, { req }) => {
        try {
            const match =
                value && (await bcrypt.compare(value, req.user.password));
            if (!match) throw new Error('password not match');
        } catch (err) {
            throw new Error(err.message);
        }
        return true;
    }),
    runValidation
];

const refreshTokenValidation = [
    cookie('refreshToken').custom((value, { req }) => {
        const decode = value && jwt.verify(value, refreshTokenKey);
        if (!decode) throw new Error('cookie not found');
        req.decode = decode;
        return true;
    }),
    runValidation
];

const forgotPasswordValidation = [
    body('email').custom(async (value, { req }) => {
        try {
            const user = await UsersModel.findOne({ email: value, active: 1 });
            if (!user) throw new Error('user not found');
            req.user = user;
        } catch (err) {
            throw new Error(err.message);
        }
        return true;
    }),
    runValidation
];

const resetPasswordValidation = [
    cookie('resetPasswordToken')
        .custom((value, { req }) => {
            const decode =
                value && jwt.verify(value, resetPasswordTokenKey);
            if (!decode) throw new Error('cookie not found');
            req.decode = decode;
            return true;
        })
        .bail({ level: 'request' }),
    param('email')
        .custom((value, { req }) => {
            if (value !== req.decode.email) throw new Error('email not match');
            req.email = value;
            return true;
        })
        .bail({ level: 'request' }),
    body('resetPasswordToken').custom(async (value, { req }) => {
        try {
            const user =
                value &&
                (await UsersModel.findOne({
                    email: req.email,
                    resetPasswordToken: value
                }));
            if (!user) throw new Error('token invalid');
            req.user = user;
        } catch (err) {
            throw new Error(err.message);
        }
        return true;
    }),
    body('password')
        .isLength({ min: 8 })
        .withMessage('password min. 8 character')
        .bail('request')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
        .withMessage(
            'password must contain uppercase, lowercase, number, and special character'
        )
        .bail({ level: 'request' }),
    body('confPassword').custom((value, { req }) => {
        if (value !== req.body.password)
            throw new Error('corfirmation password not match');
        return true;
    }),
    runValidation
];

const logoutValidation = [...refreshTokenValidation];

export {
    showUserValidation,
    findUsersValidation,
    deleteUserValidation,
    registerValidation,
    activationUserValidation,
    loginValidation,
    refreshTokenValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    logoutValidation
};
