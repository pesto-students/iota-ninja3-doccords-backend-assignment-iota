const { db } = require('../util/admin')
const config = require('../util/config')
const noImg = 'no-img.png'
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

// Profiles
exports.createProfile = (req, res) => {
  if (req.body.profileName.trim() === '') {
    return res
      .status(400)
      .json({ profileName: 'profile name must not be empty' })
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
    sharedList: []
  }
  db.collection('/documents')
    .add(newDocument)
    .then((doc) => {
      newDocument.documentId = doc.id
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
