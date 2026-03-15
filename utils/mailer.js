const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(to, subject, html) {
  try {
    const msg = {
      to,
      from: process.env.EMAIL, // your verified sender email in SendGrid
      subject,
      html,
    };

    const result = await sgMail.send(msg);
    console.log("Email sent:", result[0].statusCode);
  } catch (err) {
    console.error("Error sending email:", err.response ? err.response.body : err);
  }
}

module.exports = sendMail;