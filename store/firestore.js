const admin = require('firebase-admin');

const serviceAccount = require("../config/firebaseConfig");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.firebaseAdminConfig),
  databaseURL: `"https://${serviceAccount.firebaseAdminConfig.project_id}.firebaseio.com"`,
});

//controllers
const Exam = require('../components/exam/controller-exam');
const User = require('../components/user/controller-user');
const Login = require('../components/login/controller-login');
const Massive = require('../components/user-massive/controller-user-massive');

//db
const db = admin.firestore();

module.exports = {
  login: new Login(db),
  users: new User(db),
  exams: new Exam(db),
  massive: new Massive(db, admin)
};