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
