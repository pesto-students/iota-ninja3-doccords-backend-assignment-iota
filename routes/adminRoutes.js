const express = require('express')
const { uploader } = require('../multerSetup')
// const fileUploader = require('../util/fileUploader')
const imageUploader = require('../util/imageUploader')
const adminController = require('./../controllers/adminController')

const router = express.Router()

router.route('/healthTopics').get(adminController.getAllHealthTopics).post(adminController.createHealthTopic)
router
  .route('/healthTopics/:healthTopicId')
  .delete(adminController.deleteHealthTopic)
  .put(adminController.updateHealthTopic)
router.route('/articles').get(adminController.getAllArticles).post(adminController.createArticle)

router
  .route('/articles/:articleId')
  .get(adminController.getArticle)
  .put(adminController.updateArticle)
  .delete(adminController.deleteArticle)

router.route('/upload/image').post(uploader.single('image'), imageUploader)
module.exports = router
