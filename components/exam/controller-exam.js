const { nanoid } = require('nanoid');

class Exam {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exam');
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
    
    //Handler to set data on firestore
    async setExamData(userId, examId, exam){
        await this.verifyUserExistence(userId)
        .then(() => console.log('User verfied'));

        // set doc to user
        return await this.collection
        .doc(userId)
        .collection('examsAssigned')
        .doc(examId)
        .set(exam)

        .then(() => {
            return console.log('Exams assigned correctly');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`Bad request. Exam could not be assigned to user: ${userId}`);
        });
    }

    async createExam(data, userId) {
        // set documentId
        const examId = nanoid();

        // set creation date
        let date = new Date();
        let examDate = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}`;

        // Estructuring exam data
        let exam = {
            examId: examId,
            date: examDate,
            type: data.type,
            aditionalData: data.aditionalData || null,
            indications: data.indications,
            pdfURL: null,
            status: false,
        };
         
        //call set exam handler
        return await this.setExamData(userId, examId, exam)
        .then(() => {
            return {
                userId: userId,
                examId: examId,
            };
        });
    }
}

module.exports = Exam;
