const admin = require('firebase-admin');

const serviceAccount = require("../config/firebaseConfig");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.firebaseSimple),
  databaseURL: `"https://${serviceAccount.firebaseSimple.projectId}.firebaseio.com"`,
});

//controllers
const ExamResults = require('../components/user/controller-ExamResults');

//db
const db = admin.firestore();

module.exports = {
  results: new ExamResults(db)
};