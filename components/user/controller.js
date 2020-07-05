const firebase = require('firebase-admin');
const auth = firebase.auth();

class Users {
    constructor(db) {
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
        let user = [];
        let clinicHistory = [];
        //let date;

        // get user medical history into array
        await this.db.collection('clinicHistory')
        .doc(uid)
        .collection('consults')
        .get()
        
        .then((snapshot) => {
            return snapshot.forEach((doc) => {
                let dateId = doc.id;
                
                return clinicHistory.push({
                    dateId: dateId,
                    consult: doc.data()
                });
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
                return user.push({ 
                    id: uid,
                    userData: result, 
                    clinicHistory
                }); 
            }
        })
        .catch((err) => {
            console.error('Error getting main user info', err);
        });

        console.log(user);
        return user;
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
            identityCard: body.identityCard,
            phoneNumber: body.phoneNumber,
            numberContact: body.numberContact,
            rol: body.rol,
            clinicHistoryId: body.identityCard,
            userStatus: true,
        };

        //User exists?
        await auth.getUserByEmail(email)
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
            await auth.createUser({
                email,
                password,
                emailVerified: false,
                disabled: false,
                displayName: `${dataUser.name} ${dataUser.lastName}`,
            })
            .then(async () => {
                newUser = await this.collection
                .doc(dataUser.identityCard)
                .set(dataUser);

                return newUser;
            })
            .catch(err => {
                console.error('Error on dataUser creation', err);
                return false;
            })

        //set medical history document
            .then(async () => {
                return await this.db.collection('clinicHistory')
                .doc(dataUser.identityCard)
                .set({clinicHistoryId: dataUser.identityCard});
            })
            .catch((err) =>{
                return console.error(err);
            })

        //add "consults" as a medical history subcollections
            .then(async () => {
                return await this.db.collection('clinicHistory')
                .doc(dataUser.identityCard)
                .collection('consults')
                .add({
                    clinicHistoryId: dataUser.identityCard,
                    report: 'User Clinic history created correctly',
                    date: new Date()
                });
            })
            .catch((err) =>{
                console.error('Error on user Auth and creation: ', err);
                return false;
            });

            return newUser;
        }
    }

    async updateUser(id, body) {
        const documentId = id;
        
        //Define doc and update it
        const newData = await this.collection
        .doc(documentId)
        .update(body);

        console.log(newData);
        return newData;
    }
}

module.exports = Users;
