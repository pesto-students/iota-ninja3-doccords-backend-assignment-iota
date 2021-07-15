require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoutes')
const commonUserRouter = require('./routes/commonUserRoutes')

const userAuthMiddleware = require('./middlewares/userAuthMiddleware')
const adminAuthMiddleware = require('./middlewares/adminAuthMiddleware')

const app = express()
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// body parser
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/v1/users', userAuthMiddleware, userRouter)
app.use('/api/v1/admin', adminAuthMiddleware, adminRouter)
app.use('/api/v1', commonUserRouter)

// server
const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Server is listening on Port:${port}`)
})
