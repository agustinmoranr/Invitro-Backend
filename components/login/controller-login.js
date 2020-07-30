class Login {
  constructor(db, auth) {
    this.auth = auth;
    this.db = db;
    this.collection = this.db.collection("user");
  }
  
  async returnRol(email) {
    let rol = [];
    
    //find user rol by email
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
      console.log(rol[0], email);
    return rol[0];
  }

  async signIn(email, password) {
    // auth User
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(async (userRecord) => {
        console.log('User has logged in successfully');

        //find user rol
        let rol = await this.returnRol(email);

        return {
          email: userRecord.user.email,
          message: 'User has logged in successfully',
          rol: rol
        };
      })
      .catch((error) => {
        console.log(error);
        throw new Error(`Error: ${error.message}`);
      });
    //return singIn;
  }

  async signOut() {
    await this.auth.signOut()
    .then(() => {
      console.log('user has signed out');
      return 'user has signed out';
    })
    .catch((error) => {
      console.log(error);
      throw new Error(`Error: ${error.message}`);
    });
  }
}

module.exports = Login;
