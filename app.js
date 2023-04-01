const express = require('express')
const app = express()

const cors = require('cors')

const test = require('./router/test')
const products = require('./router/products')
const orders = require('./router/orders')

// Cors
app.use(cors())

// Allow uploads folder
app.use('/uploads', express.static('uploads'))

// Middleware for parsing JSON request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mount the users router under the services
app.use('/api', test)
app.use('/api/products', products)
app.use('/api/orders', orders)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`)
})
