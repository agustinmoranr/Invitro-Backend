const admin = require('firebase-admin');

const serviceAccount = require("../config/firebaseConfig");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `"https://${serviceAccount.project_id}.firebaseio.com"`,
});

//controllers
const User = require('../components/user/controller');

//db
const db = admin.firestore();

module.exports = {
  users: new User(db),
};