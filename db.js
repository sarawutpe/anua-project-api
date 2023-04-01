const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: '1d1d7546@us-cdbr-east-06.cleardb.net',
  user: 'be72fd49b94c48',
  password: '7bf324a3',
  database: 'heroku_acab4e5331033a7',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool
