"use strict";

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,// your smtp server hostname
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL, // smtp server username
            pass: process.env.SMTP_PASSWORD // smtp server password
        }
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, 
        to: options.email,
        subject: options.subject, 
        text: options.message
    };

    const info = await transporter.sendMail(message);
}

module.exports = sendEmail;
