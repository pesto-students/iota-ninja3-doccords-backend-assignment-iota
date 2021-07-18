const multer = require('multer')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
})

exports.bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)

exports.uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
