import nodemailer from 'nodemailer';
import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

const mail = (toEmail, subjectEmail, textEmail) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.USER_PASSWORD
		}
	});

	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: toEmail,
		subject: subjectEmail,
		text: `${textEmail}`
	};

	transporter.sendMail(mailOptions);
};

export default mail;
