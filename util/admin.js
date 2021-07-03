const admin = require('firebase-admin')

const serviceAccount = require('../service_account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'doccords-55659.appspot.com'
})

const db = admin.firestore()

module.exports = { admin, db }
