
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

mg.messages
  .create("sandbox69e8049dd782435abefd39ef70382980.mailgun.org", {
    from: "Regency <mailgun@sandbox69e8049dd782435abefd39ef70382980.mailgun.org>",
    to: ["hamzaserke@gmail.com"],
    subject: "Hello",
    text: "new test!",
    html: "<h1>new test with Mailgun awesomeness!</h1>",
  })
  .then((msg) => console.log(msg)) // logs response data
  .catch((err) => console.log(err)); // logs any error
