require('dotenv').config();
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // Use 'live' for production
  client_id: process.env.CLIENT_ID,
 client_secret: process.env.CLIENT_SECRET,
});

module.exports = paypal;
