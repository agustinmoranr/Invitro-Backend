const { nanoid } = require('nanoid');

class Consult {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
    }
    
    async createConsult(data) {
        let uid = data.identityCard;
        //let examsArray = [];
        let consult = {};
        
        //defining Id Consult Document
        let date = new Date();
        let dateId = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        
        //handler to set data
        const setConsultData = async (uid, dateId, data) => {
            return await this.db.collection('clinicHistory').doc(uid).collection('consults').doc(dateId).set(data)
            .then(() => {
                return console.log('New consult record created');
            })
            .catch((err) => {
                console.error('Error on consultCreation',err);
            });
        };

        const setExamData = async (uid, dateId, data) => {
            return await this.db.collection('clinicHistory').doc(uid).collection('consults').doc(dateId).update(data)
            .then(() => {
                return console.log('New consult record created');
            })
            .catch((err) => {
                console.error('Error on consultCreation',err);
            });
        };

        // If no exams, consult info changes
        if(data.exams.type === []) {
            consult = {
                consultData: {
                    date: new Date().toDateString(),
                    aditionalData: data.aditionalData || null,
                    indications: data.indications
                }
            };

            return await setConsultData(uid, dateId, consult);
        }

        else {
            consult = {
                consultData: {
                    date: new Date().toDateString(),
                    aditionalData: data.aditionalData || null,
                    indications: data.indications
                },
            };

            await setConsultData(uid, dateId, consult);

            let typeExam = data.exams.map((type) => {
                return type;
            });
    
            typeExam.forEach(async (exam) => {
                let examsData = {};
                let type = exam.type;
                let exams = nanoid();
                let id = `'exam-${exams}'`;

                examsData = {
                    [id]: {
                        typeExam: type,
                        status: "pending",
                        pdfURL: null,
                        examId: exams
                    },
                };
                
                await setExamData(uid, dateId, examsData);
            });
        }
        return true;
    }
}

module.exports = Consult;
