const { db } = require('../util/admin')

exports.getAllArticles = (req, res) => {
  db.collection('articles')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      const articles = []
      data.forEach((doc) => {
        console.log(doc.data().healthTopicId)

        articles.push({
          articleId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          healthTopic: doc.data().healthTopicId,
          picture: doc.data().picture,
          createdAt: doc.data().createdAt
        })
      })
      res.json(articles)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getAllHealthTopics = (req, res) => {
  db.collection('healthTopics')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      const healthTopics = []
      data.forEach((doc) => {
        healthTopics.push({
          healthTopicId: doc.id,
          title: doc.data().title,
          picture: doc.data().picture,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(healthTopics)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}
