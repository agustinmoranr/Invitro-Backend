//const firebase = require('firebase-admin');
var firebase = require("firebase/app");
require("firebase/auth");

var { firebaseSimple } = require("../../config/firebaseConfig");

firebase.initializeApp(firebaseSimple);

class Login {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection("user");
  }
  
  async returnRol(email) {
    let rol = ["data"]
    this.collection.where("email", "==", email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return console.log("No matching userDocuments.");
        }
        return snapshot.forEach((doc) => {
            console.log( doc._fieldsProto.rol.stringValue )
            return rol.push({
                data: doc.data()             
            })
        });
      })
      .catch((err) => {
          console.log('Error getting documents', err)
      })
    return rol
  }

  async singIn(email, password) {
    const singIn = firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (userRecord) {
        return {
          code: 200,
          message: userRecord.user.email,
        };
      })
      .catch(function (error) {
        return {
          code: 404,
          message: error.message,
        };
      });
    return singIn;
  }
}

module.exports = Login;
