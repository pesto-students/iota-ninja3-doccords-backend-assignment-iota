const multer = require('multer')
const { Storage } = require('@google-cloud/storage')
// Create new storage instance with Firebase project credentials
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
})

// Create a bucket associated to Firebase storage bucket
exports.bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)

// Initiating a memory storage engine to store files as Buffer objects
exports.uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // limiting files size to 5 MB
  }
})
