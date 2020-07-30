const { nanoid } = require('nanoid');

class Consult {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('clinicHistory');
    }

    // helper to verify if user exists
    async verifyUserExistence(userId) {
        //get user doc
        return await this.collection.doc(userId).get()

        .then((snapshot) => console.log('userId:', snapshot.data().identityNumber))
        .catch((error) => {
            console.error(error);
            throw new Error(`Bad request. User ${userId} could not be found.`);
        });
    }

    //Handler to set consult on firestore
    async setConsultData (userId, consultId, consult) {
        await this.verifyUserExistence(userId)
        .then(() => console.log('User verfied'));

        // set doc to user
        return await this.collection
        .doc(userId)
        .collection('consults')
        .doc(consultId)
        .set(consult)

        .then(() => {
            return console.log('New consult record created');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`Bad request. Could not set consult to user: ${userId}`);
        });
    }

    async createConsult(consultData, userId) {
        // set documentId
        let consultId = nanoid();

        // set creation date
        let date = new Date();
        let consultDate = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}`;

        //Estructuring consult data
        let consult = {
            consultId: consultId,
            date: consultDate,
            details: consultData.details
        };

        //call set consult handler
        await this.setConsultData(userId, consultId, consult);

        return {
            userId: userId,
            consultId: consultId
        };
    }

    async updateConsult(newData, consultId) {
        //query
        return await this.collection
        .doc(newData.identityNumber)
        .collection('consults')
        .doc(consultId)
        .update({"details": newData.details})
        .then(() => {
            console.log('Consult updated sir');
            return {
                consultId: consultId,
                userId: newData.identityNumber
            };
        })
        .catch(error => {
            console.log('Error during updating', error);
            throw new Error(`Bad request. Could not update consult: ${consultId} .From user: ${newData.identityNumber}`, 
            error);
        });
    }
} 

module.exports = Consult;