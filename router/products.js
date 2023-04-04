const express = require('express')
const router = express.Router()
const db = require('../db')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

// ตั้งค่าการรับข้อมูลแบบไฟล์ (รูปภาพ) กำหนดค่าที่ต้องการเก็บ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const originalFilename = file.originalname
    const fileExtension = originalFilename.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    cb(null, uniqueFilename)
  },
})

const upload = multer({ storage: storage })

// GET all products
router.get('/', async (req, res) => {
  try {
    // ใช้คำสั่งเพื่อ get ข้อมูลทั้งหมดของตาราง products
    const [result] = await db.query('SELECT * FROM products')

    // เช็คว่ามีข้อมูลหรือไม่ถ้ามีให้ส่งข้อมูลกลับไป
    if (result.length) {
      res.json({ success: true, data: result })
    } else {
      res.json({ success: false, data: [] })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET product By Id
router.get('/:id', async (req, res) => {
  try {
    // ประกาศรับตัวแปร id
    const { id } = req.params

    // ใช้คำสั่งเพื่อค้นหาสินค้าโดยใช้ id ทีี่ส่งเข้ามา
    const [result] = await db.query('SELECT * FROM products WHERE id = ?', [id])
    // เช็คว่ามีข้อมูลหรือไม่
    if (result.length > 0) {
      res.json({ success: true, data: result[0] })
    } else {
      res.json({ success: false, data: null })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CREATE a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // รับข้อมูลจากหน้าบ้าน
    const { code, name, description, price, stock } = req.body
    const file = req.file
    const image = file?.filename ?? ''

    // ใช้คำสั่ง sql เพื่อเพิ่มสินค้า
    const [result] = await db.query(
      'INSERT INTO products (code, name, description, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
      [code, name, description, price, stock, image]
    )

    // เช็คว่า rows มีการเปลี่ยนแปลงหรือไม่
    if (result.affectedRows > 0) {
      res.json({ success: true, data: [] })
    } else {
      res.json({ success: false, data: [] })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE a product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    // รับข้อมูลจากหน้าบ้าน
    const { code, name, description, price, stock } = req.body
    const file = req.file
    const image = file?.filename ?? ''
    const id = req.params.id

    // Check image
    const query = image
      ? 'UPDATE products SET code=?, name=?, description=?, price=?, stock=?, image=? WHERE id=?'
      : 'UPDATE products SET code=?, name=?, description=?, price=?, stock=? WHERE id=?'

    // 1 ==> UPDATE products SET code=?, name=?, description=?, price=?, stock=?, image=? WHERE id=?
    // 2 ==> UPDATE products SET code=?, name=?, description=?, price=?, stock=? WHERE id=?

    // ตรวจสอบรูปภาพที่เข้ามาว่ามีหรือไม่ ถ้ามีให้ใช้คำสั่งด้านบน ถ้าไม่มี 1 ให้ใช้คำสั่ง 2
    const queryValue = image
      ? [code, name, description, price, stock, image, id]
      : [code, name, description, price, stock, id]

    const [result] = await db.query(query, queryValue)

    // ตรวจสอบว่า rows มีีการเปลี่ยนแปลงหรือไม่
    if (result.affectedRows > 0) {
      res.json({ success: true, data: [] })
    } else {
      res.json({ success: false, data: [], error: 'Invalid product ID' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    // รับไอดีที่เข้ามา
    const id = req.params.id

    // ใช้คำสั่ง sql ในการลบสินค้าโดยอ้างอิงจาก id ที่เข้ามา
    const [result] = await db.query('DELETE FROM products WHERE id=?', [id])

    // ตรวจสอบว่า rows มีีการเปลี่ยนแปลงหรือไม่
    if (result.affectedRows > 0) {
      res.json({ success: true, data: [] })
    } else {
      // ถ้ามีข้อผิดพลาดให้แจ้งเตือน error Invalid product ID
      res.json({ success: false, data: [], error: 'Invalid product ID' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
