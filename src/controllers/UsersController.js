import UsersModel from '../models/UsersModel.js';
import generateRandomString from '../utils/generateRandomString.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../config/email.js';
import bcrypt from 'bcryptjs';
import {
  accessTokenKey,
  refreshTokenKey,
  resetPasswordTokenKey,
  activationUserTokenKey
} from '../config/jwt.js';
import CustomError from '../utils/CustomError.js'

const showUser = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
};

const findUsers = async (req, res, next) => {
  try {
    if (req.role !== 'admin') throw new CustomError(400, 'just admin are allowed');

    const email = req.body.email ?? '';

    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const filter = {
      email: { $regex: email }
    };

    const all_data = (await UsersModel.find(filter)).length;
    const data = await UsersModel.find(filter)
      .sort({ _id: 'desc' })
      .skip(offset)
      .limit(limit);

    const result = {
      all_data: all_data,
      all_page: Math.ceil(all_data / limit),
      crr_page: page,
      data: data
    };

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await UsersModel.deleteOne({ _id: req.user.id });
    res.status(200).json({ message: `${req.user.email} has deleted` });
  } catch (e) {
    next(e);
  }
};

const register = async (req, res, next) => {
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
    sendEmail(data.email, 'activation token', `${data.activationToken}`);

    // buat cookie activationUserToken
    const activationUserToken = jwt.sign(
      { email: data.email },
      activationUserTokenKey,
      {
        expiresIn: '300s'
      }
    );

    res.cookie('activationUserToken', activationUserToken, {
      httpOnly: true,
      maxAge: 300 * 1000,
      secure: req.protocol == 'https' ? true : false
    });

    res.status(200).json({
      message: `${registerUser.email} has registered`
    });
  } catch (e) {
    next(e);
  }
};

const activationUser = async (req, res, next) => {
  try {
    // update user.active menjadi 1
    // update user.activationUserToken dgn null
    await UsersModel.updateOne(
      { _id: req.user.id },
      { $set: { active: 1, activationToken: null } }
    );
    // hapus user dgn email yg sama, activation 0
    await UsersModel.deleteMany({ email: req.user.email, active: 0 });

    // hapus cookie activationUserToken
    res.clearCookie('activationUserToken');
    res.status(200).json({ message: `${req.user.email} has activated` });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    // buat refreshToken dgn email
    const refreshToken = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      refreshTokenKey,
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
      { id: req.user.id, email: req.user.email, role: req.user.role },
      accessTokenKey,
      {
        expiresIn: '15s'
      }
    );

    res.status(200).json(accessToken);
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const accessToken = jwt.sign(
      { id: req.decode.id, email: req.decode.email, role: req.decode.role },
      accessTokenKey,
      {
        expiresIn: '15s'
      }
    );

    res.status(200).json(accessToken);
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // update user.resetPasswordToken dgn 20 random string
    const randomString = generateRandomString(30);

    await UsersModel.updateOne(
      { _id: req.user.id },
      { $set: { resetPasswordToken: randomString } }
    );
    // kirim 20 random string ke email
    sendEmail(req.user.email, 'reset password token', `${randomString}`);

    // buat cookie resetPasswordToken
    const resetPasswordToken = jwt.sign(
      { email: req.user.email },
      resetPasswordTokenKey,
      {
        expiresIn: '300s'
      }
    );
    res.cookie('resetPasswordToken', resetPasswordToken, {
      httpOnly: true,
      maxAge: 300 * 1000,
      secure: req.protocol == 'https' ? true : false
    });
    res.status(200).json({
      message: `reset password token has delivered`
    });
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
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
    res.status(200).json({ message: 'reset password success' });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    /* code */
    // hapus cookie refreshToken
    res.clearCookie('refreshToken');
    // update user.refreshToken dgn null
    await UsersModel.updateOne(
      { email: req.decode.email, active: 1 },
      { $set: { refreshToken: null } }
    );
    res.status(200).json({ message: 'logged out' });
  } catch (e) {
    next(e);
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
