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
require("firebase/auth");

firebase.initializeApp(firebaseConfig);

//controllers
const Login = require('../components/login/controller-login');
const User = require('../components/user/controller-user');
const Massive = require('../components/user-massive/controller-user-massive');
const Consult = require('../components/consult/controller-consult');
const Exam = require('../components/exam/controller-exam');
const Result = require('../components/result/controller-result');

//services 
const db = admin.firestore();
const auth = firebase.auth();
const adminAuth = admin.auth();

//Bucket on firebase storage
const storageBucket = admin.storage().bucket(firebaseConfig.storageBucket);

module.exports = {
  login: new Login(db, auth),
  users: new User(adminAuth, db),
  massive: new Massive(db, admin),
  consults: new Consult(db),
  exams: new Exam(db),
  results: new Result(db, storageBucket)
};