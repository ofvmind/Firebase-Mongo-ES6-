import nodemailer from "nodemailer";
import config from "../config.js";

const sendActivationMail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: "valdi",
    to,
    subject: "Activation Mail",
    text: "",
    html: `
      <div>
        <p>Follow the link to activate your accout Dear ${to}</p>
        <a href="${link}">CLick for activate</a>
      </div>
    `
  });
};

export default sendActivationMail;