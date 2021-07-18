const { db } = require('../util/admin')

exports.getAllArticles = (req, res) => {
  db.collection('articles')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      const articles = []
      data.forEach((doc) => {
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

exports.getSharedDocs = (req, res) => {
  const id = req.body.shareId
  const email = req.body.shareEmail
  let filteredList = []
  console.log(id)
  db.doc(`/shares/${id}`)
    .get()
    .then((doc) => {
      console.log(doc.data())
      const documentsList = doc.data().documentsList
      const sharedList = []
      db.collection('/documents')
        .get()
        .then((data) => {
          data.forEach((doc) => {
            if (documentsList.includes(doc.id)) {
              sharedList.push({ documentId: doc.id, ...doc.data() })
            }
            filteredList = sharedList.filter((item) => item.sharedList.includes(email))
          })
          return res.status(200).json({ documents: filteredList, success: true })
        })
        .catch((err) => {
          res.status(500).json({ error: 'something went wrong' })
          console.error(err)
        })
    })
}
