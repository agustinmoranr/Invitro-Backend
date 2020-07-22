const { getSubCollectionDoc, updateAuthenticationValue } = require('../../utils/reusable-firebase-methods');

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
        let uid = id;
        let User = [];
        let ClinicHistory = [];
        let Exams = [];

        // get user medical history into array
        await getSubCollectionDoc(
            this.db.collection('clinicHistory'), //query
            uid, //docId
            'consults', //subcollection
            ClinicHistory, //array to push data
            'This user has never had a consult.', //message if doc not exists
            "consultId", //propId
            "consult", //prop data
            'Error gettig consult.' // error message
            );
    
        // get the user exams assigned 
        await getSubCollectionDoc(
            this.db.collection('exam'),
            uid,
            'examsAssigned',
            Exams,
            'No exams have been assigned to this user.',
            "examId",
            "exam",
            'Error getting user exams'
            );

        //Set complete user data
        await this.collection.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
            return  console.log('User Not found');
            } 
            else {
                //firestore user document
                return User.push({ 
                    id: uid,
                    userData: doc.data(), 
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
        let userData = {
            name: body.name,
            lastName: body.lastName,
            email: email,
            documentType: body.documentType,
            identityNumber: body.identityNumber,
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
                displayName: `${userData.name} ${userData.lastName}`,
            })
            .then(async () => {
                newUser = await this.collection
                .doc(userData.identityNumber)
                .set(userData);

                return newUser;
            })
            .catch(err => {
                throw new Error ('Error on user creation. please, try again', err);
            })

        //set medical history document
            .then(async () => {
                return await this.db.collection('clinicHistory')
                .doc(userData.identityNumber)
                .set({identityNumber: userData.identityNumber});
            })
            .catch((err) =>{
                return console.error(err);
            })

        //set exams assigment document
            .then(async () => {
                return await this.db.collection('exam')
                .doc(userData.identityNumber)
                .set({identityNumber: userData.identityNumber});
            })
            .catch((err) =>{
                return console.error(err);
            });

        return {
            email: email,
            identityNumber: userData.identityNumber
        };
        }
    }

    async ableAndDisableUser(id, newData) { 
        await updateAuthenticationValue(
            this.auth.getUserByEmail(newData.email), // getUser
            this.auth, //authentication firebase service
            "disabled", //Prop to update
            newData.disabled //new prop value
        )

        // update value in firestore
        .then(async () => {
            return await this.updateUserInfo(id, {"userStatus": !newData.disabled});
        })
        .catch((err) => {
            console.log('Error updating user', err);
        });
        return {
            Warning: 'user status has been updated',
            userStatus: !newData.disabled
        };
    }

    async changeEmail(id, newData) {
        await updateAuthenticationValue(
            this.auth.getUserByEmail(newData.currentEmail), // getUser
            this.auth, //authentication firebase service
            "email", //Prop to update
            newData.newEmail //new prop value
        ) 
        // update email in firestore
        .then(async () => {
            return await this.updateUserInfo(id, {"email": newData.newEmail});
        })
        .catch((err) => {
            console.log('Error updating user', err);
        });
        return {
            status: 'New email updated',
            email: newData.newEmail
        };
    }

    async updateUserInfo(id, newData) {
        const docId = id;
        
        //Define which doc and update it
        await this.collection
        .doc(docId)
        .update(newData);

        //console.log(newData);
        return {
            status: 'New data updated',
            newData
        };
    }
}

module.exports = Users;
