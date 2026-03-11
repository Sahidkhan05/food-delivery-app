const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Welcome Email
const sendWelcomeEmail = async (email, role) => {

  let message = "";

  if (role === "user") {
    message = "Welcome to FoodExpress 🍔. You can now order delicious food!";
  }

  if (role === "restaurant") {
    message = "Thanks for registering your restaurant. Our team will review it soon.";
  }

  if (role === "deliveryBoy") {
    message = "Welcome Delivery Partner 🚴. Your request is under review.";
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to FoodExpress",
    text: message,
  });

  console.log("Welcome email sent successfully");

};

// Forgot Password Email
const sendEmail = async (email, subject, message) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  });

  console.log("Reset password email sent");

};

module.exports = {
  sendWelcomeEmail,
  sendEmail
};