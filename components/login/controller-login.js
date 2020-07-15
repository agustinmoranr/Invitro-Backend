class Login {
  constructor(db, auth) {
    this.auth = auth;
    this.db = db;
    this.collection = this.db.collection("user");
  }
  
  async returnRol(email) {
    let rol = [];
    await this.collection.where("email", "==", email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return console.log("No matching userDocuments.");
        }
        return snapshot.forEach((doc) => {
          //console.log(doc.data())
            return rol.push(doc.data().rol);
        });
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });
      console.log(rol);
    return rol;
  }

  async singIn(email, password) {
    const singIn = this.auth
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
