const express = require('express')
const router = express.Router()
const db = require('../db')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

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
    const [result] = await db.query('SELECT * FROM products')
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
  const { id } = req.params
  try {
    const [result] = await db.query('SELECT * FROM products WHERE id = ?', [id])
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
    const { code, name, description, price, stock } = req.body
    const file = req.file
    const image = file?.filename ?? ''

    const [result] = await db.query(
      'INSERT INTO products (code, name, description, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
      [code, name, description, price, stock, image]
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

// UPDATE a product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { code, name, description, price, stock } = req.body
    const file = req.file
    const image = file?.filename ?? ''
    const id = req.params.id

    // Check image
    const query = image
      ? 'UPDATE products SET code=?, name=?, description=?, price=?, stock=?, image=? WHERE id=?'
      : 'UPDATE products SET code=?, name=?, description=?, price=?, stock=? WHERE id=?'

    const queryValue = image
      ? [code, name, description, price, stock, image, id]
      : [code, name, description, price, stock, id]

    const [result] = await db.query(query, queryValue)

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
    const id = req.params.id

    const [result] = await db.query('DELETE FROM products WHERE id=?', [id])

    if (result.affectedRows > 0) {
      res.json({ success: true, data: [] })
    } else {
      res.json({ success: false, data: [], error: 'Invalid product ID' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
