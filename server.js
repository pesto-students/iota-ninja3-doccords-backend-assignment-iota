const express = require('express')
const app = express()

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Doccords' })
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server is listening on Port:${PORT}`)
})
