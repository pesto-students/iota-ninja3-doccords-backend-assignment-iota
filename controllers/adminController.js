const { db } = require('../util/admin')

exports.createHealthTopic = (req, res) => {
  if (req.body.title.trim() === '' || req.body.picture.trim() === '') {
    return res.status(400).json({ title: 'Title must not be empty' })
  }
  const newHealthTopic = {
    title: req.body.title,
    picture: req.body.picture,
    createdAt: new Date().toISOString()
  }

  db.collection('healthTopics')
    .add(newHealthTopic)
    .then((doc) => {
      const resHealthTopic = newHealthTopic
      resHealthTopic.healthTopicId = doc.id
      res.json({ data: resHealthTopic, success: true })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
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

exports.deleteHealthTopic = (req, res) => {
  db.collection('healthTopics')
    .doc(req.params.healthTopicId)
    .delete()
    .then(() => {
      res.json({ message: 'successfully deleted', success: true })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

exports.updateHealthTopic = (req, res) => {
  if (req.body.title.trim() === '' || req.body.picture.trim() === '') {
    return res.status(400).json({ title: 'Title must not be empty' })
  }
  const updatedHealthTopic = {
    title: req.body.title,
    picture: req.body.picture,
    updatedAt: new Date().toISOString()
  }
  db.doc(`/healthTopics/${req.params.healthTopicId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Health topic not found' })
      }
      return doc.ref.update(updatedHealthTopic)
    })
    .then(() => {
      updatedHealthTopic.healthTopicId = req.params.healthTopicId
      res.status(200).json({ data: updatedHealthTopic, success: true })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

// Articles

exports.createArticle = (req, res) => {
  if (req.body.title.trim() === '') {
    return res.status(400).json({ title: 'title must not be empty' })
  }
  if (req.body.description.trim() === '') {
    return res.status(400).json({ title: 'description must not be empty' })
  }

  const healthTopicId = ''
  const newArticle = {
    title: req.body.title,
    picture: req.body.picture,
    description: req.body.description,
    healthTopicId,
    createdAt: new Date().toISOString()
  }
  db.doc(`/healthTopics/${req.body.healthTopicId}`)
    .get()
    .then((doc) => {
      newArticle.healthTopicId = doc.id
      return db.collection('articles').add(newArticle)
    })
    .then((doc) => {
      const resArticle = newArticle
      resArticle.articleId = doc.id
      res.status(201).json({ data: resArticle, success: true })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

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
          healthTopicId: doc.data().healthTopicId,
          picture: doc.data().picture,
          createdAt: doc.data().createdAt
        })
      })
      res.status(200).json({ articles, success: true })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getArticle = (req, res) => {
  db.doc(`/articles/${req.params.articleId}`)
    .get()
    .then((doc) => {
      res.json(doc.data())
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.deleteArticle = (req, res) => {
  db.collection('articles')
    .doc(req.params.articleId)
    .delete()
    .then(() => {
      res.json({ message: 'successfully deleted', success: true })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.message })
    })
}

exports.updateArticle = (req, res) => {
  const updatedAricle = {
    title: req.body.title,
    picture: req.body.picture,
    description: req.body.description,
    healthTopicId: req.body.healthTopicId,
    updatedAt: new Date().toISOString()
  }
  db.doc(`/articles/${req.params.articleId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Article not found' })
      }
      return doc.ref.update(updatedAricle)
    })
    .then(() => {
      res.status(200).json({ data: updatedAricle, success: true })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}
