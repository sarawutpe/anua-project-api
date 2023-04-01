const express = require('express')
const router = express.Router()

// GET Test
router.get('/', async (req, res) => {
  try {
    res.send('Hello World!')
  } catch (err) {
    console.error(err)
  }
})

module.exports = router
