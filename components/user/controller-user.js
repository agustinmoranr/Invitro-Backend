class Users {
    constructor(auth, db) {
        this.auth = auth;
        this.db = db;
        this.collection = this.db.collection('user');
    }

    async listUsers() {
        let users = [];
        // get all users docs
        await this.collection.get()
        .then(snapshot => {
            return snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
              return users.push({
                    id: doc.id,
                    UserData: doc.data()
                });
            });
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });

        return users;
    }

    async getUserByIdentification(id) {
        let result;
        let uid = id;
        let User = [];
        let ClinicHistory = [];
        let Exams = [];

        // get user medical history into array
        await this.db.collection('clinicHistory')
        .doc(uid)
        .collection('consults')
        .get()
        
        .then((snapshot) => {
            return snapshot.forEach((doc) => {
                if(!doc.exists) {
                    return ClinicHistory.push({message: 'This user has never had a consult.'});
                }
                else {
                    let consultId = doc.id;
                    
                    return ClinicHistory.push({
                        consultId: consultId,
                        consult: doc.data()
                    });
                }
            });
        })
        .catch(err => {
            console.log('Error getting user medical history', err);
        });

        // get the exams assigned to user
        await this.db.collection('exam')
        .doc(uid)
        .collection('examsAssigned')
        .get()
        
        .then((snapshot) => {
            return snapshot.forEach((doc) => {
                if(!doc.exists) {
                    return Exams.push({message: "No exams have been assigned to this user"});
                }
                else {
                    let examId = doc.id;
                    
                    return Exams.push({
                        examId: examId,
                        exam: doc.data()
                    });
                }
            });
        })
        .catch(err => {
            console.log('Error getting user medical history', err);
        });  
            
        //Set complete user data
        await this.collection.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
            return  console.log('User Not found');
            } 
            else {
                result = doc.data();

                //firebase user document
                return User.push({ 
                    id: uid,
                    userData: result, 
                    ClinicHistory,
                    Exams
                }); 
            }
        })
        .catch((err) => {
            console.error('Error getting main user info', err);
        });

        //console.log(user);
        return User;
    }

    async createUser(body) {
        let newUser;
        let user = [];

        // get email and pass
        const email = body.email;
        const password = body.password;

        // User document in firestore
        let dataUser = {
            name: body.name,
            lastName: body.lastName,
            email: email,
            documentType: body.documentType,
            identityNumber: body.identityNumber,
            phoneNumber: body.phoneNumber,
            numberContact: body.numberContact,
            rol: body.rol,
            userStatus: true,
        };

        //User exists?
        await this.auth.getUserByEmail(email)
        .then((userRecord) => {
            return user.push(userRecord.email);
        })
        .catch((error) => {
            return console.log("creating user...");
        });

        if(user[0] !== undefined) {
            console.log('The user already exists, try using a different email.', user[0]);
            throw new Error("Error ocurred");
        } 

        else {
        //create user in firebase Authentication and firestore
            await this.auth.createUser({
                email,
                password,
                emailVerified: false,
                disabled: false,
                displayName: `${dataUser.name} ${dataUser.lastName}`,
            })
            .then(async () => {
                newUser = await this.collection
                .doc(dataUser.identityNumber)
                .set(dataUser);

                return newUser;
            })
            .catch(err => {
                throw new Error ('Error on user creation. please, try again', err);
            })

        //set medical history document
            .then(async () => {
                return await this.db.collection('clinicHistory')
                .doc(dataUser.identityNumber)
                .set({identityNumber: dataUser.identityNumber});
            })
            .catch((err) =>{
                return console.error(err);
            })

        //set exams assigment document
            .then(async () => {
                return await this.db.collection('exam')
                .doc(dataUser.identityNumber)
                .set({identityNumber: dataUser.identityNumber});
            })
            .catch((err) =>{
                return console.error(err);
            });

        return newUser;
        }
    }

    async ableAndDisableUser(id, body) {
        await this.auth.getUserByEmail(body.email)
        .then(async (userRecord) => {
            console.log('user', userRecord.toJSON());
            return await this.auth.updateUser(userRecord.uid, {
                "disabled": body.disabled
            })
            .then((userRecord) => {
                return console.log('Successfully updated user', userRecord.toJSON());
            });
        })  
        .then(async () => {
            return await this.updateUserInfo(id, {"userStatus": !body.disabled});
        })
        .catch((err) => {
            console.log('Error updating user', err);
        });
    }

    async changeEmail(id, body) {
        await this.auth.getUserByEmail(body.lastEmail)
        .then(async (userRecord) => {
            console.log('user', userRecord.toJSON());
            return await this.auth.updateUser(userRecord.uid, {
                "email": body.newEmail
            })
            .then((userRecord) => {
                return console.log('Successfully updated user', userRecord.toJSON());
            });
        })  
        .then(async () => {
            return await this.updateUserInfo(id, {"email": body.newEmail});
        })
        .catch((err) => {
            console.log('Error updating user', err);
        });
    }

    async updateUserInfo(id, body) {
        const documentId = id;
        
        //Define doc and update it
        const newData = await this.collection
        .doc(documentId)
        .update(body);

        //console.log(newData);
        return newData;
    }
}

module.exports = Users;
