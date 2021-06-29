const { admin, db } = require('../util/admin')
const checkForToken = require('../util/checkForToken')

module.exports = (req, res, next) => {
  checkForToken(req, res)
  const idToken = req.idToken
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = { decodedToken, idToken }
      return db.doc(`/users/${decodedToken.uid}`).get()
    })
    .then((doc) => {
      if (doc.exists && doc.data().profileType === 'admin') {
        next()
      }
    })
    .catch((err) => {
      console.error('Error', err)
      return res.status(403).json(err)
    })
}
