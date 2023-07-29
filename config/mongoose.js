const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost/ERMS');
  console.log("Successfully connected to database.")
}

const db = mongoose.connection;

module.exports = db;