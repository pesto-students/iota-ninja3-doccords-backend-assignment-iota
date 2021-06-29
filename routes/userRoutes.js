const express = require('express')
const userController = require('./../controllers/userController')
const { uploader } = require('../multerSetup')
const imageUploader = require('../util/imageUploader')

const router = express.Router()

router
  .route('/')
  .get(userController.getUserDetail)
  .post(userController.createUser)

router.route('/upload/file').post(uploader.single('image'), imageUploader)
module.exports = router
