const admin = require('firebase-admin');

const serviceAccount = require("../config/firebaseConfig");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.firebaseAdminConfig),
  databaseURL: `"https://${serviceAccount.firebaseAdminConfig.project_id}.firebaseio.com"`,
});

//controllers
const User = require('../components/user/controller-user');
const Login = require('../components/login/controller-login')

//db
const db = admin.firestore();

module.exports = {
  login: new Login(db),
  users: new User(db),
};