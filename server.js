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

// exports.uploadImage = (req, res) => {
//   console.log(req.body.name)
//   const BusBoy = require('busboy')
//   const path = require('path')
//   const os = require('os')
//   const fs = require('fs')
//   const { uuid } = require('uuidv4')

//   const busboy = new BusBoy({
//     headers: req.headers
//   })

//   let imageFileName
//   let imageToBeUploaded = {}

//   busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//     console.log(fieldname, filename, encoding, mimetype)

//     if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
//       return res.status(400).json({
//         error: '❌ Wrong file type submitted'
//       })
//     }

//     const imageExtension = filename.split('.')[filename.split('.').length - 1]

//     imageFileName = `${Math.round(
//       Math.random() * 1000000000000
//     )}.${imageExtension}`

//     const filepath = path.join(os.tmpdir(), imageFileName)

//     imageToBeUploaded = {
//       filepath,
//       mimetype
//     }

//     file.pipe(fs.createWriteStream(filepath))
//   })

//   busboy.on('finish', () => {
//     console.log(imageToBeUploaded)
//     admin
//       .storage()
//       .bucket(config.storageBucket)
//       .upload(imageToBeUploaded.filepath, {
//         resumable: false,
//         metadata: {
//           metadata: {
//             contentType: imageToBeUploaded.mimetype,
//             firebaseStorageDownloadTokens: uuid()
//           }
//         }
//       })
//       .then(() => {
//         const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
//         console.log(imageUrl)
//         // return db.doc(`/users/${req.user.handle}`).update({
//         //   imageUrl
//         // })
//       })
//       .then(() => {
//         return res.json({
//           message: '✅ Image uploaded successfully'
//         })
//       })
//       .catch((err) => {
//         console.error(err)
//         return res.status(500).json({
//           error: err.code
//         })
//       })
//   })
//   req.pipe(busboy)
// }
