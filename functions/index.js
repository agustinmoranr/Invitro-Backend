const functions = require('firebase-functions');
const admin = require('firebase-admin')
const userController = require('./components/users/UserController.js')

admin.initializeApp()

exports.welcomeEmail = functions.auth
  .user()
  .onCreate(userController.userCreationController)
