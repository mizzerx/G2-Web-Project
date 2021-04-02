const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { dev } = require('../env.json');

const CLIENT_ID = dev.CLIENT_ID;
const CLIENT_SECRET = dev.CLIENT_SECRET;
const REFRESH_TOKEN = dev.REFRESH_TOKEN;
const REDIRECT_URI = dev.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (user, mail, article) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'vuhunglcute@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
    });

    const mailOptions = {
      from: 'ADMIN <vuhunglcute@gmail.com>',
      to: `${mail}`,
      subject: 'SYSTEM NOTIFICATION - DO NOT REPLY',
      text: 'New article has been created',
      html: `<h1>NEW ARTICLE</h1><br /><p>Article: <strong>${article.title}</strong> just created by <strong>${user.username}</strong></strong></p>`,
    };

    const result = await transport.sendMail(mailOptions);

    console.log('Mail sent...', result);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { sendMail };
