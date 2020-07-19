const { firebaseAdmin, firebaseConfig } = require('../config/firebaseConfig');

//admin config
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(firebaseAdmin),
  databaseURL: `"https://${firebaseAdmin.project_id}.firebaseio.com"`,
});

//config for storage
const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/storage");

firebase.initializeApp(firebaseConfig);

//controllers
const User = require('../components/user/controller-user');
const Login = require('../components/login/controller-login');
const Massive = require('../components/user-massive/controller-user-massive');
const Exam = require('../components/exam/controller-exam');
const Result = require('../components/result/controller-result');

//services 
const db = admin.firestore();
const auth = admin.auth();

//Bucket on firebase storage
const storageBucket = admin.storage().bucket(firebaseConfig.storageBucket);

module.exports = {
  login: new Login(db),
  users: new User(auth, db),
  massive: new Massive(db, admin),
  exams: new Exam(db),
  results: new Result(db, storageBucket)
};