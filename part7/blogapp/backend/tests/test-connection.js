const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('URI being used:', uri ? uri.replace(/:[^:@]+@/, ':XXXXX@') : 'UNDEFINED');

mongoose
  .connect(uri, { family: 4 })
  .then(() => {
    console.log('SUCCESS: connected to MongoDB');
    process.exit(0);
  })
  .catch((error) => {
    console.log('FAILED:', error.message);
    console.log('Raw length:', uri.length);
    console.log('JSON view:', JSON.stringify(uri));
    process.exit(1);
  });

setTimeout(() => {
  console.log('Still hanging after 15 seconds');
  process.exit(1);
}, 15000);
