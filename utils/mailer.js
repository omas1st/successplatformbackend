const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

const sendMail = async (subject, text) => {
  await transporter.sendMail({
    from: `"Success UK49s Platform" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
  });
};

module.exports = sendMail;
