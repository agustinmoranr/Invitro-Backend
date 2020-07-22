const { nanoid } = require('nanoid');

class Consult {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('clinicHistory');
    }

    async createConsult(consultData, userId) {
        // set documentId
        let consultId = nanoid();

        // set creation date
        let date = new Date();
        let consultDate = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}`;

        //Handler to set data on firestore
        const setConsultData = async (userId, consultId, consult) => {
            await this.collection.doc(userId).get()
            .then(async (snapshot) => {
                // validate if userId is an existent user.
                if(snapshot.data().identityNumber !== userId) {
                    throw new Error(`Bad request. Can not find user: ${userId}`);
                }
                // set doc to user
                else {
                    return await this.collection
                    .doc(userId)
                    .collection('consults')
                    .doc(consultId)
                    .set(consult)
        
                    .then(() => {
                        return console.log('New consult record created');
                    })
                    .catch((err) => {
                        console.error('Error on consult creation', err);
                        throw new Error(`Bad request. Could not set consult to user: ${userId}`);
                    });
                }
            });
        };

        //Estructuring consult data
        let consult = {
            consultId: consultId,
            date: consultDate,
            details: consultData.details
        };

        //query
        await setConsultData(userId, consultId, consult);

        return {
            "userId": userId,
            "consultId": consultId
        };
    }

    async updateConsult(newData, consultId) {
        //query
        await this.collection
        .doc(newData.identityNumber)
        .collection('consults')
        .doc(consultId)
        .update(newData)

        .then(() => {
            return console.log('Consult updated sir');
        })
        .catch(error => {
            console.log('Error during updating', error);
            throw new Error(`Bad request. Could not update consult: ${consultId}`);
        });

        return {
            consultId: consultId
        };
    }
} 

module.exports = Consult;