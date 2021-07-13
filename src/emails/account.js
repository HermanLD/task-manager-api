const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hmndardonoutlook.com",
    subject: "Thanks for joining",
    text: `Welcome to the app, ${name}`,
  });
};

const sendFarewellEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hmndardon@outlook.com",
    subject: `Hey ${name}, please let us know why you are leaving`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendFarewellEmail,
};
