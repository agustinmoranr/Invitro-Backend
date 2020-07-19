const { nanoid } = require('nanoid');

class Exam {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exam');
    }
    
    async createExam(data, userId) {
        // set documentId
        const examId = nanoid();

        // set creation date
        let date = new Date();
        let examDate = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}`;

        //Handler to set data on firestore
        const setExamData = async (userId, examId, exam) => {
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
                    .collection('examsAssigned')
                    .doc(examId)
                    .set(exam)
        
                    .then(() => {
                        return console.log('Exams assigned correctly');
                    })
                    .catch((err) => {
                        console.error('Error assignig exams',err);
                        throw new Error(`Bad request. Could not set exam to user: ${userId}`);
                    });
                }
            });
        };

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
         
        //query
        await setExamData(userId, examId, exam);

        return {
            userId: userId,
            examId: examId,
        };
    }
}

module.exports = Exam;
