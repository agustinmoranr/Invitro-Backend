const { Email } = require("../utilities/EmailHelper.js");
const { templateWelcomeEmail } = require("../utilities/EmailTemplate.js");
// const admin = require("firebase-admin"); --Activate when you need add data to firestore DB

class UserAdmin {
  //register user email in firestore DB
  //   emailUserRegister(names, email) {
  //     console.log("email registered");
  //     return admin.firestore().collection("usersemail").add({
  //       names: names,
  //       email: email,
  //     });
  //   }

  sendWelcomeEmail(names, email) {
    const to = email;
    const from = "info@gmail.com";

    const textHtml = templateWelcomeEmail(names);

    const objEmail = new Email();

    return objEmail.sendEmail(
      from,
      to,
      "",
      "Welcome to In Vitro Clinics Exams System",
      textHtml
    );
  }
}

exports.UserAdmin = UserAdmin;
