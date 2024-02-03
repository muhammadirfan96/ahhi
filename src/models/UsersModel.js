import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
	{
		email: String,
		password: String,
		role: String,
		active: Number,
		activationToken: String,
		refreshToken: String,
		resetPasswordToken: String
	},
	{ timestamps: true }
);

const UsersModel = mongoose.model('users', usersSchema);

export default UsersModel;
