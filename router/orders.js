const express = require('express')
const router = express.Router()
const db = require('../db')
const { json } = require('body-parser')

// GET all orders
router.get('/', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM orders')
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
    const { customerName, customerEmail, customerDetails, orderDetails } = req.body

    const [result] = await db.query(
      'INSERT INTO orders (customerName, customerEmail, customerDetails, orderDetails) VALUES (?, ?, ?, ?)',
      [customerName, customerEmail, customerDetails, orderDetails]
    )

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
