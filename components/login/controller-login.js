//const firebase = require('firebase-admin');
var firebase = require("firebase/app");
require("firebase/auth");

var {firebaseSimple} = require('../../config/firebaseConfig')

firebase.initializeApp(firebaseSimple);

class Login {
    constructor(db) {
        this.db = db
        this.collection = this.db.collection('user')
    }

    async singIn(email, password){
        const singIn = firebase.auth().signInWithEmailAndPassword(email,password)
        .then(function(userRecord){
            console.log('Successfully fetched user data:', userRecord.user.email);
        }).catch(function(error) {
            console.log('Error fetching user data:', error);
        });
        console.log(singIn)
        return singIn
    }
}

module.exports = Login