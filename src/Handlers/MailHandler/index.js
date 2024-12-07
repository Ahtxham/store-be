// Libraries
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const GeneralHelper = require('../../Services/GeneralHelper');
const Message = require('../../Constants/Message.js');
const RoleConstant = require('../../Constants/Role');

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    maxMessages: 50,
  });
}

async function verifyTransport(transport) {
  let res;
  await transport.verify(function (error, success) {
    if (error) {
      return error;
    } else {
      console.log('Server is ready to take our messages');
      return error;
    }
  });

  return res;
}

function generateHtmlToSend(fileName, replacements) {
  const filePath = path.join(__dirname, `./MailTempletes/${fileName}`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  return template(replacements);
}

function setMailOptions(email, subject, fileName, replacements) {
  return {
    from: process.env.MAIL_FROM,
    to: email,
    subject: subject,
    html: generateHtmlToSend(fileName, replacements),
  };
}

async function sendNewUserEmail(data) {
  const { firstName, lastName, email, roleName, code, restaurantInfo } = data;

  let payload = {};
  if ([RoleConstant.RESTAURANT].includes(roleName)) {
    let link = `${process.env.FRONT_APP_URL}/verification?code=${code}&email=${email}`;
    const restaurantName = `${firstName} ${lastName}`;
    const replacements = {
      appName: process.env.APP_NAME,
      restaurantName,
      link,
    };

    payload = {
      subject: `Thank you for joining Mataeim as a Restaurant [${restaurantName}]`,
      file: 'new-restaurant.html',
      email,
      replacements,
    };
  } else {
    const restaurantName = `${restaurantInfo.firstName} ${restaurantInfo.lastName}`;
    const userName = `${firstName} ${lastName}`;
    const replacements = {
      appName: process.env.APP_NAME,
      userName,
      restaurantName,
      roleName,
    };

    payload = {
      subject: `Thank you for joining ${restaurantName} as ${roleName} `,
      file: 'new-user.html',
      email,
      replacements,
    };
  }

  sendEmail(payload);
}

function sendUserInvitationEmail(data) {
  const { email, code, restaurantName, role } = data;
  let link = `${process.env.FRONT_APP_URL}/Signup?code=${code}&email=${email}`;
  const replacements = {
    appName: process.env.APP_NAME,
    restaurantName,
    role,
    link,
  };

  const payload = {
    subject: `Invitation to join ${restaurantName}`,
    file: 'invite-user.html',
    email,
    replacements,
  };

  sendEmail(payload);
}

function sendForgotPasswordEmail(email, replacements) {
  const payload = {
    subject: Message.RESET_PASSWORD,
    file: 'forgot-password.html',
    email,
    replacements,
  };

  sendEmail(payload);
}

function sendBusinessApprovalEmail(email, replacements) {
  const payload = {
    subject: Message.APPROVED,
    file: 'business-approval.html',
    email,
    replacements,
  };

  sendEmail(payload);
}

async function sendEmail(payload) {
  var transport = createTransport();
  await verifyTransport(transport);

  const { subject, file, email, replacements } = payload;
  const assetsPath = `${process.env.BACK_APP_URL}/Assets`;
  const mailOptions = setMailOptions(email, subject, file, { ...replacements, assetsPath });
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('\x1b[31m%s\x1b[0m', error);
    } else {
      console.log('\x1b[36m%s\x1b[0m', `Email sent successfully. ${info.response}`);
    }
  });
}

module.exports = {
  sendNewUserEmail,
  sendUserInvitationEmail,
  sendForgotPasswordEmail,
  sendBusinessApprovalEmail,
};
