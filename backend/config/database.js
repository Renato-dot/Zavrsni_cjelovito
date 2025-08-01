const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'ucka.veleri.hr',
  user: process.env.DB_USER || 'rprebeg',
  password: process.env.DB_PASSWORD || '11',
  database: process.env.DB_NAME || 'rprebeg'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;