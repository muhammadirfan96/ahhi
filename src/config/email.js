import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let userEmail;
process.env.NODE_ENV === 'production'
    ? (userEmail = 'muhammadirfanirfani808@gmail.com')
    : (userEmail = process.env.USER_EMAIL);

let userPassword;
process.env.NODE_ENV === 'production'
    ? (userPassword = 'wgffjcgnivuavqbj')
    : (userPassword = process.env.USER_PASSWORD);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userEmail,
        pass: userPassword
    }
});

const sendEmail = (toEmail, subjectEmail, textEmail) => {
    const mailOptions = {
        from: userEmail,
        to: toEmail,
        subject: subjectEmail,
        text: `${textEmail}`
    };

    transporter.sendMail(mailOptions);
};

export { sendEmail };
