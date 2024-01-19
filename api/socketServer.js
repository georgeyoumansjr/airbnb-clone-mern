const nodemailer = require("nodemailer");

const sendTestEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.ger-rei.com",
      port: 465, // Secure port for SMTPS
      secure: true, // Use SSL
      auth: {
        user: "contact@ger-rei.com",
        pass: "Ohappydays@1", // Replace with your actual email password
      },
    });

    const mailOptions = {
      from: "contact@ger-rei.com",
      to: "codeinspire1@gmail.com", // Replace with your email for testing
      subject: "Test Email",
      text: "This is a test email from Nodemailer.",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

sendTestEmail();

