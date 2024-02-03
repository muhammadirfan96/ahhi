import express from 'express';
import {
	showUser,
	findUsers,
	deleteUser,
	register,
	activationUser,
	login,
	refreshToken,
	forgotPassword,
	resetPassword,
	logout
} from '../controllers/UsersController.js';
import {
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
} from '../validations/UsersValidation.js';
import verifyToken from '../middlewares/verifyToken.js';
const UsersRouter = express.Router();

UsersRouter.get('/user/:id', verifyToken, showUserValidation, showUser);
UsersRouter.get('/users',verifyToken, findUsersValidation, findUsers);
UsersRouter.delete('/user/:id',verifyToken, deleteUserValidation, deleteUser);
UsersRouter.post('/register', registerValidation, register);
UsersRouter.patch(
	'/activation-user/:email',
	activationUserValidation,
	activationUser
);
UsersRouter.post('/login', loginValidation, login);
UsersRouter.get('/refresh-token', refreshTokenValidation, refreshToken);
UsersRouter.post('/forgot-password', forgotPasswordValidation, forgotPassword);
UsersRouter.patch(
	'/reset-password/:email',
	resetPasswordValidation,
	resetPassword
);
UsersRouter.delete('/logout', logoutValidation, logout);

export default UsersRouter;
