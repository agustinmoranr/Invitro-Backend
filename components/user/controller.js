const firebase = require('firebase-admin');
const auth = firebase.auth();

class Users {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('user');
    }

    async listUsers() {
        let users = [];
        await this.collection.get()
        .then(snapshot => {
            return snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
              return users.push({
                    id: doc.id,
                    data: doc.data()
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
        let uid;
        let user = [];

        //Get user
        await this.collection.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
            return  console.log('User Not found');
            } else {
              uid = doc.data().identityCard;
              result = doc.data();
              return user.push(result); // firebase user document
            }
        })
        .catch((err) => {
            console.error('Error getting main user info', err);
        });

        // get user medical history
        await this.db.collection('clinicHistory').doc(uid).collection('consults').get()
        .then((snapshot) => {
            return snapshot.forEach((doc) => {
                let date = doc.data().date;
                return user.push({
                    [date]: {
                    id: doc.id,
                    data: doc.data()
                    }
                }); 
            });
        })
        .catch(err => {
        console.log('Error getting user medical history', err);
        });
        console.log(user);
        return user;
    }

    async createUser(body) {
        let newUser;

        let user = [];

        const email = body.email;
        const password = body.password;

        let dataUser = {
            name: body.name,
            lastName: body.lastName,
            documentType: body.documentType,
            identityCard: body.identityCard,
            phoneNumber: body.phoneNumber,
            numberContact: body.numberContact,
            rol: body.rol,
            clinicHistoryId: body.identityCard,
            userStatus: true
        };

        //User exists?
        const isUserCreated = async () => {
            await auth.getUserByEmail(email)
            .then((userRecord) => {
                //console.log(userRecord.toJSON())
                return user.push(userRecord.toJSON());
            })
            .catch((error) => {
                return console.log('User is not in firebase Auth: ', error.message);
            });
        };
        user = await isUserCreated();
        console.log(user);

        if(user) {
            console.log('The user already exists, try using a different email.', user);
            return false;
        } else {
            //create And auth User
            await auth.createUser({email, password})
            .then(async () => {
                newUser = await this.collection.doc(dataUser.identityCard).set(dataUser);
                return newUser;
            })
            .then(async () => {
               
                const createClinicHistory = await this.db.collection('clinicHistory')
                .doc(dataUser.identityCard)
                .collection('consults')
                .set({
                    clinicHistoryId: dataUser.identityCard,
                    report: 'User Clinic history created correctly'
                });
                return createClinicHistory;
            })
            .then(async () => {
                return await this.db.collection('clinicHistory').doc(dataUser.identityCard).set({clinicHistoryId: dataUser.identityCard})
            })
            .catch((err) =>{
                console.log('Error on user Auth and creation: ', err);
                return false;
            });
            return newUser;
        }
    }

    async updateUser(id, body) {

        const documentId = id;
        //isAdmin?

        const newData = await this.collection.doc(documentId).update(body);
        console.log(newData);
        return newData;

    }
}

module.exports = Users;
