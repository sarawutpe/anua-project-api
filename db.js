const mysql = require('mysql2/promise')

// กำหนดการเชื่อมต่อกับ mysql (ฐานข้อมูล)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'anua_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool
