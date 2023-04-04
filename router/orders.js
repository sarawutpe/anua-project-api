const express = require('express')
const router = express.Router()
const db = require('../db')

// GET all orders
router.get('/', async (req, res) => {
  try {
    // ใช้คำสั่ง sql เพื่อ query ออร์เดอร์ทั้งหมด
    const [result] = await db.query('SELECT * FROM orders')

    // เช็คว่ามีข้อมูลหรือไม่
    if (result.length) {
      res.json({ success: true, data: result })
    } else {
      res.json({ success: false, data: [] })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CREATE a new order
router.post('/', async (req, res) => {
  try {
    // ปรับกาศรับข้อมูลจากหน้าบ้าน
    const { customerName, customerEmail, customerDetails, orderDetails } = req.body

    // ใช้คำสั่ง sql เพื่อเพื่อเพิ้่มออร์เดอร์จากข้อมูลทีี่เข้ามา
    const [result] = await db.query(
      'INSERT INTO orders (customerName, customerEmail, customerDetails, orderDetails) VALUES (?, ?, ?, ?)',
      [customerName, customerEmail, customerDetails, orderDetails]
    )

    // เช็คว่ามีการเปลี่ยนแปลงของ rows หรือไม่
    if (result.affectedRows > 0) {
      res.json({ success: true, data: [] })
    } else {
      res.json({ success: false, data: [] })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
