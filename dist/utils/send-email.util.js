"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    // send mail with defined transport object
    let message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    };
    const info = await transporter.sendMail(message);
    // console.log(info);
    // console.log("Message sent: %s", info.messageId);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=send-email.util.js.map