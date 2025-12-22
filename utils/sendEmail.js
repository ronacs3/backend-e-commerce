const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Tạo transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true cho port 465, false cho các port khác
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 2. Cấu hình email
  const message = {
    from: `"E-Commerce Shop" <${process.env.SMTP_USER}>`, // Tên người gửi
    to: options.email,
    subject: options.subject,
    html: options.html, // Nội dung dạng HTML
  };

  // 3. Gửi email
  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
