const { nanoid } = require('nanoid');

class Consult {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
    }
    
    async createConsult(data) {
        let uid = data.identityCard;
        let exams = [];
        let consult = {};
        
        //defining Id Consult Document
        let date = new Date();
        let dateId = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        
        // If no exams, consult info changes
        if(data.exams.type === []) {
            consult = {
                consultData: {
                    date: new Date().toDateString(),
                    aditionalData: data.aditionalData || null,
                    indications: data.indications
                }
            };
        }

        else {
            let typeExam = data.exams.map((type) => {
                return type;
            });
    
            typeExam.forEach((exam) => {
                let type = exam.type;

                return exams.push({
                    typeExam: type,
                    status: "pending",
                    pdfURL: null,
                    examId: nanoid()
                });
            });

            consult = {
                consultData: {
                    date: new Date().toDateString(),
                    aditionalData: data.aditionalData || null,
                    indications: data.indications
                },
                exams: exams
            };
            //console.log(consult);
        }
        
        //set consult as a document
        return await this.db.collection('clinicHistory').doc(uid).collection('consults').doc(dateId).set(consult)
        .then(() => {
            return console.log('New consult record created');
        })
        .catch((err) => {
            console.error('Error on consultCreation',err);
        });
    }
}

module.exports = Consult;
