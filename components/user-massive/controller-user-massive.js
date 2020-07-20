class Massive {
  constructor(db, admin) {
    this.db = db;
    this.collection = this.db.collection("user");
    this.admin = admin;
  }

  async insertUsers(jsonUsers) {
    let messages = [];
    let message;

    for (let i = 0; i < jsonUsers.length; i++) {

      // Create user in firebase authentication
      message = await this.admin
        .auth()
        .createUser({
          email: jsonUsers[i]["email"],
          emailVerified: false,
          password: jsonUsers[i]["password"],
          disabled: false,
          displayName: `${jsonUsers[i]["name"]} ${jsonUsers[i]["lastName"]}`,
        })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          return console.log(
            "New user successfully created:",
            userRecord.email,
            jsonUsers[i]
            );
        })
       
        // Create users data en firestore
        .then(async () => {
          return await this.collection
          .doc(jsonUsers[i]["identityNumber"])
          .set({
            name: jsonUsers[i]["name"],
            lastName: jsonUsers[i]["lastName"],
            email: jsonUsers[i]["email"],
            documentType: jsonUsers[i]["documentType"],
            identityNumber: jsonUsers[i]["identityNumber"],
            numberContact: jsonUsers[i]["numberContact"],
            rol: jsonUsers[i]["rol"],
            userStatus: true,
          });
        })

        //set medical history document
        .then(async () => {
          return await this.db.collection('clinicHistory')
          .doc(jsonUsers[i]["identityNumber"])
          .set({identityNumber: jsonUsers[i]["identityNumber"]});
        })

        //set exams assigment document
        .then(async () => {
          return await this.db.collection('exam')
          .doc(jsonUsers[i]["identityNumber"])
          .set({identityNumber: jsonUsers[i]["identityNumber"]});
        })

        //queryAnswers
        .then(() => {
          console.log("succesfully inserted");

          return {
            "User email": jsonUsers[i]["email"],
            Result: "Succesfully created",
          };
        })
        .catch((error) => {
          console.error(error.message);
          throw new Error(`user email: ${jsonUsers[i]["email"]} Result: ${error.code}`);
        });

        messages.push(message);
    }

    return messages;
  }
}

module.exports = Massive;
