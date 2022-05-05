//db connection
const mongoose = require('mongoose');

//database url
require('dotenv').config()

//open database connection
main()
  .then(() => {})
  .catch((err) => console.log(err));
async function main() {
  let connection = await mongoose.connect(process.env.url);
  if (connection) {
    console.log("db connected");
  }
}
module.exports = main;