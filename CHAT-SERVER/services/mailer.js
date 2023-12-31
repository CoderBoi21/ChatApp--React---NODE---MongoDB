const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({path:'../config.env'});
const transporter = nodemailer.createTransport({
    service: 'gamil',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ankursapariya123@gmail.com",
        pass: "hbeu ukwy tcrc qgkj",
    },
});

const sendMail = async (transporter, msg) => {
    try {
        await transporter.sendMail(msg);
        console.log("Email has been sent successfully")
    } catch (err) {
        console.error(err);
    }
}

const sendSGMail = async ({
    recipient,
    sender,
    subject,
    html,
    text,
    attachments,
}) => {
    try {
        const from = sender || "ankursapariya28@gmail.com";
        const msg = {
            from: from,
            to: recipient, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
            attachments: attachments,
        };
        return sendMail(transporter, msg);
    } catch (error) {
        console.log(error);
    }
}

exports.sendEmail = async (args) => {
    if (!process.env.NODE_ENV === 'development') {
        return new Promise.resolve();
    } else {
        return sendSGMail(args);
    }
}