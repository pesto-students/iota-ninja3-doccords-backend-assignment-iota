const express = require('express')
const userController = require('./../controllers/userController')
const { uploader } = require('../multerSetup')
const imageUploader = require('../util/imageUploader')

const router = express.Router()

router
  .route('/')
  .get(userController.getUserDetail)
  .post(userController.createUser)
  .put(userController.updateUser)

router.route('/notify').get(userController.notifyClient)

router.route('/topHealthTopics').get(userController.getTopHealthTopicsByUser)
router
  .route('/profiles')
  .get(userController.getAllProfilesByUser)
  .post(userController.createProfile)
  .delete(userController.deleteProfilesAndDocs)

router.route('/profiles/:profileId').put(userController.updateProfile)

router
  .route('/documents')
  .get(userController.getAllDocumentsByUser)
  .post(userController.createDocument)
  .delete(userController.deleteDocuments)

router.route('/documents/access').put(userController.updateAccess)
router.route('/documents/share').post(userController.shareDocuments)
router.route('/documents/share/:shareId').get(userController.getSharedDocs)

router.route('/upload/file').post(uploader.single('image'), imageUploader)
module.exports = router
