const express = require('express')
const userController = require('./../controllers/userController')
const { uploader } = require('../multerSetup')
const imageUploader = require('../util/imageUploader')

const router = express.Router()

router.route('/').get(userController.getUserDetail).post(userController.createUser)
router.route('/topHealthTopics').get(userController.getTopHealthTopicsByUser)
router
  .route('/profiles')
  .get(userController.getAllProfilesByUser)
  .post(userController.createProfile)
  .delete(userController.deleteProfilesAndDocs)

router.route('/profiles/:profileId').put(userController.updateProfile)

router.route('/documents').get(userController.getAllDocumentsByUser).post(userController.createDocument)
router.route('/documents/share').post(userController.shareDocuments)

router.route('/upload/file').post(uploader.single('image'), imageUploader)
module.exports = router
