const { UserAdmin } = require('./UserAdmin.js')

exports.userCreationController = user => {
  const userAdmin = new UserAdmin()

  return userAdmin
    .sendWelcomeEmail(user.displayName, user.email)
    //--Activate when you need to register data in firestore
    // .then(() => {
    //   return userAdmin.emailUserRegister(
    //     user.displayName,
    //     user.email
    //   )
    // })
    // .catch(error => {
    //   console.error(`Error creating user => ${error}`)
    // })
}
