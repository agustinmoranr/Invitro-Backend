class Login {
  constructor(db, auth) {
    this.auth = auth
    this.db = db;
    this.collection = this.db.collection("user");
  }
  
  async returnRol(email) {
    let rol = []
    this.collection.where("email", "==", email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return console.log("No matching userDocuments.");
        }
        return snapshot.forEach((doc) => {
            return rol.push(
                doc.data()             
            )
        });
      })
      .catch((err) => {
          console.log('Error getting documents', err)
      })
    return rol
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
