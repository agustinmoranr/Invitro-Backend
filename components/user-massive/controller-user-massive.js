class Massive {
  constructor(db, admin) {
    this.db = db;
    this.collection = this.db.collection("user");
    this.admin = admin;
  }

  async insertUsers(jsonUsers) {
    let messages = [];
    const users = jsonUsers;
    for (let i = 0; i < jsonUsers.length; i++) {
      let message = await this.admin
        .auth()
        .createUser({
          email: jsonUsers[i]["email"],
          emailVerified: false,
          password: "ENtrANYmaTen",
          disabled: false,
          displayName: `${jsonUsers[i]["name"]} ${jsonUsers[i]["lastName"]}`,
        })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log(
            "Successfully created new user:",
            userRecord.email,
            users
          );
          // Create users data en firestore
          this.collection
            .doc(users[i]["identityCard"])
            .set({
              name: jsonUsers[i]["name"],
              lastName: jsonUsers[i]["lastName"],
              documentType: jsonUsers[i]["documentType"],
              numberContact: jsonUsers[i]["numberContact"],
              rol: jsonUsers[i]["rol"],
              userStatus: true,
            })
            .then(() => {
              console.log("succesfully inserted");
            })
            .catch((error) => {
              console.log(error);
            });
          return {
            "User email": jsonUsers[i]["email"],
            Result: "Succesfully created",
          };
        })
        .catch( (error) => {
          // console.log("Error creating new user:", error);
          return { "User email": jsonUsers[i]["email"], Result: error.code };
        });
      messages.push(message);
    }
    return messages;
  }
}

module.exports = Massive;
