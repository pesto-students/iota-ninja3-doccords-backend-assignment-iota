const express = require('express')
const commonUserController = require('./../controllers/commonUserController')

const router = express.Router()

router.route('/articles').get(commonUserController.getAllArticles)
router.route('/healthTopics').get(commonUserController.getAllHealthTopics)

module.exports = router
