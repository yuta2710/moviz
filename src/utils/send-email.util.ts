import nodemailer, { TransportOptions } from "nodemailer";

interface MailerOptionProps {
  email: string;
  subject: string;
  message: string;
}
// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (options: MailerOptionProps) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as TransportOptions);

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
