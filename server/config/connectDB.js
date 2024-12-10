const mysql = require('mysql2');

async function connectToDB() {
  return await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'bd'
  });
}

module.exports = { connectToDB };
