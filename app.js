const express = require('express')
const app = express()
const cors = require('cors')

// นำเข้าไฟล์ api
const test = require('./router/test')
const products = require('./router/products')
const orders = require('./router/orders')

// เปิดใช้งานฟังก์ชัน core เพื่อให้สามารถใช้ api ได้
// Cors
app.use(cors())

// กำหนดเส้นทางรูปภาพ เพื่อให้ผู้ใช้สามารถดูรูปภาพได้
// Allow uploads folder
app.use('/uploads', express.static('uploads'))

// กำหนดการใช้งาน json เพื่อให้ api สามารถรับ json ได้
// Middleware for parsing JSON request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// กำหนดเส้นทาง api ที่ต้องการให้ใช้งาน
// Mount the users router under the services
app.use('/api', test)
app.use('/api/products', products)
app.use('/api/orders', orders)

// ประกาศตัวแปร port และรันเซิฟเวอร์ที่ port 4000
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`)
})
