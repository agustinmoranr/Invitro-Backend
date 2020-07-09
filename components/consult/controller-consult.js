const { nanoid } = require('nanoid');

class Consult {
    constructor(db) {
        this.db = db;
    }
    
    async createConsult(data) {
        let uid = data.identityCard;
        let consult = {};

        //defining Id Consult Document
        let date = new Date();
        let consultId = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        
        //Queries/handlers to set data
        const setConsultData = async (uid, consultId, consult) => {
            return await this.db.collection('clinicHistory')
            .doc(uid)
            .collection('consults')
            .doc(consultId)
            .set(consult)

            .then(() => {
                return console.log('New consult record created');
            })
            .catch((err) => {
                console.error('Error on consult creation',err);
            });
        };

        const setExamData = async (uid, consultId, exam) => {
            return await this.db.collection('exam')
            .doc(uid)
            .collection('examsAssigned')
            .doc(consultId)
            .set(exam)

            .then(() => {
                return console.log('Exams assigned correctly');
            })
            .catch((err) => {
                return console.error('Error assignig exams',err);
            });
        };

        // validate data
        if(!Array.isArray(data.exams)){
            console.log('Bad request. "exams" is not an array');
            throw new Error();
        }

        // If no exams, just set the consult
        if(!data.exams[0] === true) {

            consult = {
                consultId: consultId,
                date: new Date().toDateString(),
                aditionalData: data.aditionalData || null,
                indications: data.indications,
                exams: "No exams assigned to this consult."
            };

            return await setConsultData(uid, consultId, consult);
        }
        // If also exams. Also set exams
        else {
            consult = {
                consultId: consultId,
                date: new Date().toDateString(),
                aditionalData: data.aditionalData || null,
                indications: data.indications
            };
            
            await setConsultData(uid, consultId, consult);
    
            let typeExam = data.exams.map((type) => {
                return type;
            });
    
            typeExam.forEach(async (exam) => {
                let type = exam.type;
                let id = nanoid();
                
                let Exam = {
                    consultId: consultId,
                    examId: id,
                    typeExam: type,
                    status: false,
                    pdfURL: null,
                };
                
                //set each exam
                await setExamData(uid, id, Exam);
            });
        }
        return true;
    }
}

module.exports = Consult;
