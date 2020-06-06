const admin = require('firebase-admin');
const { config } = require('../config');

//const serviceAccount = require(config);

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://in-vitro-470ae.firebaseio.com",
});

const db = admin.firestore();

module.exports = {
    //instances
};