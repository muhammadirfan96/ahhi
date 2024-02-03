import UsersModel from '../models/UsersModel.js';
import generateRandomString from '../utils/generateRandomString.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import email from '../config/email.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const showUser = async (req, res) => {
	try {
		const result = req.user;
		logger.info('data readed', { meta: req.logMeta });
		return res.status(200).json(result);
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const findUsers = async (req, res) => {
	try {
		/* code */
		const email = req.body.email ?? '';

		const limit = parseInt(req.query.limit ?? 20);
		const page = parseInt(req.query.page ?? 1);
		const offset = limit * page - limit;

		const filter = {
			email: { $regex: email }
		};

		const all_data = (await UsersModel.find(filter)).length;
		const data = await UsersModel.find(filter).skip(offset).limit(limit);

		const result = {
			all_data: all_data,
			all_page: Math.ceil(all_data / limit),
			crr_page: page,
			data: data
		};

		logger.info('data readed', { meta: req.logMeta });
		return res.status(200).json(result);
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		await UsersModel.deleteOne({ _id: req.user.id });
		logger.info(`${req.user.email} has deleted`, {
			meta: req.logMeta
		});
		return res
			.status(200)
			.json({ message: `${req.user.email} has deleted` });
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const register = async (req, res) => {
	try {
		/* code */
		// tambah user baru ke database dgn nilai active = 0 dan activationUserToken = 20 random string
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const randomString = generateRandomString(30);

		const data = {
			email: req.body.email,
			password: hashedPassword,
			role: 'user',
			active: 0,
			activationToken: randomString,
			refreshToken: null,
			resetPasswordToken: null
		};

		const newUser = new UsersModel(data);
		const registerUser = await newUser.save();

		// kirim 20 random string ke email
		email(data.email, 'activation token', `${data.activationToken}`);

		// buat cookie activationUserToken
		const activationUserToken = jwt.sign(
			{ email: data.email },
			process.env.ACTIVATION_USER_TOKEN,
			{
				expiresIn: '300s'
			}
		);

		res.cookie('activationUserToken', activationUserToken, {
			httpOnly: true,
			maxAge: 300 * 1000,
			secure: req.protocol == 'https' ? true : false
		});

		logger.info(`${registerUser.email} has registered`, {
			meta: req.logMeta
		});
		return res
			.status(200)
			.json({ message: `${registerUser.email} has registered` });
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const activationUser = async (req, res) => {
	try {
		// update user.active menjadi 1
		// update user.activationUserToken dgn null
		await UsersModel.updateOne(
			{ _id: req.user.id },
			{ $set: { active: 1, activationToken: null } }
		);
		// hapus cookie activationUserToken
		res.clearCookie('activationUserToken');
		logger.info(`${req.user.email} has activated`, {
			meta: req.logMeta
		});
		return res
			.status(200)
			.json({ message: `${req.user.email} has activated` });
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const login = async (req, res) => {
	try {
		// buat refreshToken dgn email
		const refreshToken = jwt.sign(
			{ email: req.user.email },
			process.env.REFRESH_TOKEN,
			{
				expiresIn: '1d'
			}
		);
		// update user.refreshToken dgn refreshToken
		await UsersModel.updateOne(
			{ _id: req.user.id },
			{ $set: { refreshToken: refreshToken } }
		);

		// buat cookie refreshToken
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			secure: req.protocol == 'https' ? true : false
		});

		// buat accessToken
		const accessToken = jwt.sign(
			{ email: req.user.email },
			process.env.ACCESS_TOKEN,
			{
				expiresIn: '600s'
			}
		);

		logger.info('logged in', { meta: req.logMeta });
		res.status(200).json(accessToken);
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const refreshToken = async (req, res) => {
	try {
		const accessToken = jwt.sign(
			{ email: req.decode.email },
			process.env.ACCESS_TOKEN,
			{
				expiresIn: '600s'
			}
		);

		logger.info(`already refresh token`, { meta: req.logMeta });
		res.status(200).json(accessToken);
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		// update user.resetPasswordToken dgn 20 random string
		const randomString = generateRandomString(30);

		await UsersModel.updateOne(
			{ _id: req.user.id },
			{ $set: { resetPasswordToken: randomString } }
		);
		// kirim 20 random string ke email
		email(req.user.email, 'reset password token', `${randomString}`);

		// buat cookie resetPasswordToken
		const resetPasswordToken = jwt.sign(
			{ email: req.user.email },
			process.env.RESET_PASSWORD_TOKEN,
			{
				expiresIn: '300s'
			}
		);
		res.cookie('resetPasswordToken', resetPasswordToken, {
			httpOnly: true,
			maxAge: 300 * 1000,
			secure: req.protocol == 'https' ? true : false
		});
		logger.info(`reset password token has delivered`, {
			meta: req.logMeta
		});
		return res.status(200).json({
			message: `reset password token has delivered`
		});
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		/* code */
		// cek cookie resetPasswordToken
		// verifikasi 20 random string yg dikirim oleh user dgn user.resetPasswordToken
		// update user.password dgn password baru
		// update user.resetPasswordToken dgn null
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		await UsersModel.updateOne(
			{ email: req.user.email, active: 1 },
			{ $set: { password: hashedPassword, resetPasswordToken: null } }
		);

		// hapus cookie resetPasswordToken
		res.clearCookie('resetPasswordToken');
		logger.info('reset password success', { meta: req.logMeta });
		return res.status(200).json({ message: 'reset password success' });
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

const logout = async (req, res) => {
	try {
		/* code */
		// hapus cookie refreshToken
		res.clearCookie('refreshToken');
		// update user.refreshToken dgn null
		await UsersModel.updateOne(
			{ email: req.decode.email, active: 1 },
			{ $set: { refreshToken: null } }
		);
		logger.info('logged out', { meta: req.logMeta });
		return res.status(200).json({ message: 'logged out' });
	} catch (err) {
		logger.error(err.message, { meta: req.logMeta });
		return res.status(500).json({ message: err.message });
	}
};

export {
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
};
