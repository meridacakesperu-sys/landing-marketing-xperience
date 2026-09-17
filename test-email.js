const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'eduarps9513@gmail.com',
    pass: 'barhgayoiyrtjnyc',
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Verify error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
