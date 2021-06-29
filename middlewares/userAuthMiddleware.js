const { admin } = require('../util/admin')
const checkForToken = require('../util/checkForToken')

module.exports = (req, res, next) => {
  checkForToken(req, res)
  const idToken = req.idToken
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = { decodedToken, idToken }
      return next()
    })
    .catch((err) => {
      console.error('Error while verifying token ', err)
      return res.status(403).json(err)
    })
}
