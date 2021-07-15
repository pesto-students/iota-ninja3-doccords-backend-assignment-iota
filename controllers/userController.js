/* eslint-disable no-unused-vars */
const { db } = require('../util/admin')
const config = require('../util/config')
const noImg = 'no-img.png'
const nodemailer = require('nodemailer')
const Email = require('email-templates')
const { sendNotificationToClient } = require('../util/notify')
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD,
//     clientId: process.env.OAUTH_CLIENTID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN
//   }
// })
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'doccords@gmail.com',
    pass: '123456789qwe$$'
  }
})

const emailTemplate = new Email({
  views: { root: './emails', options: { extension: 'ejs' } },
  message: {
    from: 'doccords@gmail.com'
  },
  preview: false,
  send: true,
  transport: transporter
})

exports.getUserDetail = (req, res) => {
  db.doc(`/users/${req.user.decodedToken.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.status(200).json({ user: doc.data() })
      } else {
        res.status(404).json({ user: 'usr not found' })
      }
    })
}
exports.createUser = (req, res) => {
  const newUser = {
    profileName: req.body.profileName,
    profilePic:
      req.body.profilePic ||
      `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
    email: req.body.email,
    phone: req.body.phone,
    profileType: 'free'
  }
  db.doc(`/users/${req.user.decodedToken.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(200).json({ user: doc.data() })
      } else {
        return db.doc(`/users/${req.user.decodedToken.uid}`).set(newUser)
      }
    })
    .then(() => {
      // const { profileName, profilePic, profileType } = newUser
      // console.log(doc.data())
      // return res.status(201).json({ profileName, profilePic, profileType })
      return db.doc(`/users/${req.user.decodedToken.uid}`).get()
    })
    .then((doc) => {
      if (doc.exists) {
        res.status(200).json({ user: doc.data() })
      } else {
        res.status(404).json({ user: 'user not found' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ general: err.message })
    })
}

exports.updateUser = (req, res) => {
  const nToken = req.body.token
  db.doc(`/users/${req.user.decodedToken.uid}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ status: false, data: 'user not found' })
      } else {
        const notificationTokens = doc.data().notificationTokens || []
        if (notificationTokens.includes(nToken)) {
          return res.status(200).json({ status: true, data: 'no need to update' })
        }
        notificationTokens.push(nToken)
        return doc.ref.update({ notificationTokens })
      }
    })
    .then(() => {
      return res.status(200).json({ status: true, data: 'updated successfully' })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ general: err.message })
    })
}

// Profiles
exports.createProfile = (req, res) => {
  if (req.body.profileName.trim() === '') {
    return res.status(400).json({ profileName: 'profile name must not be empty' })
  }

  const newProfileData = {
    picture: req.body.picture,
    relationshipId: req.body.relationshipId,
    profileName: req.body.profileName,
    age: req.body.age,
    email: req.body.email,
    phone: req.body.email,
    gender: req.body.gender,
    knownIssues: req.body.knownIssues,
    userId: req.user.decodedToken.uid,
    createdAt: new Date().toISOString()
  }
  db.collection('/profiles')
    .add(newProfileData)
    .then((doc) => {
      const resProfile = newProfileData
      resProfile.profileId = doc.id
      // if (req.body.document.link) {
      //   const newDocumentData = {
      //     name: req.body.document.name,
      //     link: req.body.document.link,
      //     healthTopicId: req.body.document.healthTopicId,
      //     userId: req.user.decodedToken.uid,
      //     profileId: doc.id,
      //     sharedList: []
      //   }
      //   db.collection('/documents').add(newDocumentData)
      // }
      res.status(201).json({ data: resProfile, success: true })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}
exports.updateProfile = (req, res) => {
  const updatedProfile = {
    picture: req.body.picture,
    relationshipId: req.body.relationshipId,
    profileName: req.body.profileName,
    age: req.body.age,
    email: req.body.email,
    phone: req.body.email,
    gender: req.body.gender,
    knownIssues: req.body.knownIssues
  }
  db.doc(`/profiles/${req.params.profileId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      return doc.ref.update(updatedProfile)
    })
    .then(() => {
      res.status(200).json({ data: updatedProfile, success: true })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}
exports.getAllProfilesByUser = (req, res) => {
  db.collection('/profiles')
    .where('userId', '==', req.user.decodedToken.uid)
    .get()
    .then((data) => {
      const profiles = []
      data.forEach((doc) => {
        profiles.push({
          profileId: doc.id,
          ...doc.data()
        })
      })
      return res.status(200).json({ data: profiles, success: true })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}
exports.getAllDocumentsByUser = (req, res) => {
  db.collection('/documents')
    .where('userId', '==', req.user.decodedToken.uid)
    .get()
    .then((data) => {
      const documents = []
      data.forEach((doc) => {
        documents.push({
          documentId: doc.id,
          ...doc.data()
        })
      })
      return res.status(200).json({ data: documents, success: true })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}
exports.createDocument = (req, res) => {
  const newDocument = {
    name: req.body.name,
    link: req.body.link,
    healthTopicId: req.body.healthTopicId,
    userId: req.user.decodedToken.uid,
    profileId: req.body.profileId,
    sharedList: [],
    suggestedTopic: req.body.suggestedTopic
  }
  db.collection('/documents')
    .add(newDocument)
    .then((doc) => {
      newDocument.documentId = doc.id
      if (
        newDocument.healthTopicId === 'none' &&
        newDocument.suggestedTopic.trim() !== ''
      ) {
        db.collection('/suggestedTopics').add({
          documentId: doc.id,
          suggestedTopic: newDocument.suggestedTopic,
          status: 'pending'
        })
      }
      res.status(201).json({ data: newDocument, success: true })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ general: err.message })
    })
}

exports.deleteProfilesAndDocs = (req, res) => {
  const profileList = req.body.profiles
  const docList = req.body.documents
  console.log(req.body)
  if (profileList.length > 0) {
    profileList.forEach((element) => {
      db.collection('profiles').doc(element).delete()
    })
  }
  if (docList.length > 0) {
    docList.forEach((element) => {
      db.collection('documents').doc(element).delete()
    })
  }
  res.status(200).json({ success: true })
}

exports.shareDocuments = (req, res) => {
  const documentsList = req.body.documentIds
  const email = req.body.email

  if (documentsList.length > 0) {
    documentsList.forEach(async (document) => {
      const list = await db.doc(`/documents/${document}`).get()
      if (!list.data().sharedList.includes(email)) {
        db.collection('documents')
          .doc(document)
          .update({ sharedList: [...list.data().sharedList, email] })
      }
    })
    db.collection('/shares')
      .add({ documentsList })
      .then((doc) => {
        let name = 'ela'
        // const mailOptions = {
        //   from: 'doccords@gmail.com',
        //   to: email,
        //   subject: 'This mail is from doccords',
        //   text: `Hi from your nodemailer project ${doc.id}`
        // }
        // transporter.sendMail(mailOptions, function (err, data) {
        //   if (err) {
        //     console.log('Error ' + err)
        //   } else {
        //     console.log('Email sent successfully')
        //   }
        // })
        db.doc(`/users/${req.user.decodedToken.uid}`)
          .get()
          .then((doc) => {
            if (doc.exists) {
              name = doc.data().profileName
            } else {
              res.status(404).json({ user: 'usr not found' })
            }
          })
        emailTemplate
          .send({
            template: 'share',
            message: {
              to: email
            },
            locals: {
              name,
              count: documentsList.length,
              id: doc.id
            }
          })
          .then(() => {
            console.log('success email')
            return res.status(200).json({ success: true })
          })
          .catch('Error email', console.error)
        // return res.status(200).json({ success: true })
      })
  }
}
exports.getTopHealthTopicsByUser = (req, res) => {
  db.collection('profiles')
    .where('userId', '==', req.user.decodedToken.uid)
    .get()
    .then((data) => {
      const topHealthTopics = {}
      data.forEach((doc) => {
        if (doc.data().knownIssues) {
          doc.data().knownIssues.forEach((issueId) => {
            if (topHealthTopics[issueId]) {
              topHealthTopics[issueId] = topHealthTopics[issueId] + 1
            } else {
              topHealthTopics[issueId] = 1
            }
          })
        }
      })
      res.json(topHealthTopics)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}
exports.updateAccess = (req, res) => {
  const { documentId, sharedList } = req.body
  console.log(documentId, sharedList)
  db.doc(`/documents/${documentId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Document not found', success: false })
      }
      return doc.ref.update({ sharedList })
    })
    .then(() => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

exports.deleteDocuments = (req, res) => {
  const docList = req.body.documentIds
  console.log(req.body)

  if (docList.length > 0) {
    docList.forEach((element) => {
      db.collection('documents').doc(element).delete()
    })
    res.status(200).json({ success: true })
  }
}

exports.getSharedDocs = (req, res) => {
  const id = req.params.shareId
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
          })
          return res.status(200).json({ documents: sharedList, success: true })
        })
        .catch((err) => {
          res.status(500).json({ error: 'something went wrong' })
          console.error(err)
        })
    })
}

exports.notifyClient = (req, res) => {
  db.doc(`/users/${req.user.decodedToken.uid}`)
    .get()
    .then((doc) => {
      const notificationTokens = doc.data().notificationTokens || []
      if (doc.exists && notificationTokens.length > 0) {
        console.log('is it calling twice')
        sendNotificationToClient(notificationTokens, {
          title: 'Suggested topic',
          body: 'your suggestion got added please update your document'
        })
        res.status(200).json({ success: true })
      } else {
        res.status(200).json({ success: true })
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}
