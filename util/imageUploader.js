// Upload endpoint to send file to Firebase storage bucket
const { bucket } = require('../multerSetup')
// eslint-disable-next-line camelcase
const { v4: uuid_v4 } = require('uuid')

module.exports = async (req, res, next) => {
  const currentTime = Date.now()
  try {
    if (typeof req.file === 'undefined') {
      res.status(400).json({ message: 'failed', success: false })
    }

    // Create new blob in the bucket referencing the file
    const blob = bucket.file(`${req.file.originalname}_${currentTime}`)

    // Create writable stream and specifying file mimetype
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        firebaseStorageDownloadTokens: uuid_v4()
      }
    })

    blobWriter.on('error', (err) => next(err))

    blobWriter.on('finish', () => {
      // Assembling public URL for accessing the file via HTTP
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`

      // Return the file name and its public URL
      res
        .status(200)
        .send({ fileName: req.file.originalname, fileLocation: publicUrl })

      res.uploadedFile = {
        fileName: req.file.originalname,
        fileLocation: publicUrl
      }
    })
    // When there is no more data to be consumed from the stream
    blobWriter.end(req.file.buffer)
  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`)
  }
}
