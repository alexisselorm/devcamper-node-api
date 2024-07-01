const nodemailer = require("nodemailer");


console.log(process.env.SMTP_HOST);

const sendEmail = async (options) => {


  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_EMAIL} <${process.env.FROM_NAME}>`, // sender address
    to: options.to,
    subject: options.subject,
    text: options.message, 
  }

  const info = await transporter.sendMail(message)



  console.log("Message sent: %s", info.messageId);
}


module.exports=sendEmail