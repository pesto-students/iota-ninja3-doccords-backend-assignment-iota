const express = require('express')
const app = express()

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Doccords' })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is listening on Port:${port}`)
})
