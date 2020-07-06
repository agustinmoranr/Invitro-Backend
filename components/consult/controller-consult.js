class Consult {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
        //this.storage = firebase.storage();
    }
    
    
    async createConsult(data) {
        let uid = data.identityCard;
        let exams = [];
        let consultData = {};
        
        let date = new Date();
        let dateId = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if(!data.type) {
            consultData = {
                consult: {
                    date: new Date(),
                    aditionalData: data.aditionalData || null,
                    indications: data.indications
                }
            };
        }

        let typeExam = data.exams.map((key) => {
            return key;
        });
        
        typeExam.forEach((exam) => {
            let type = exam.type;

            return exams.push({
                typeExam: type,
                status: "pending",
                pdfURL: null
            });
        });

        consultData = {
            consult: {
                date: new Date().toDateString(),
                aditionalData: data.aditionalData || null,
                indications: data.indications
            },
            exams: exams
        };
        console.log(consultData);

        return await this.db.collection('clinicHistory').doc(uid).collection('consults').doc(dateId).set(consultData)
        .then(() => {
            return console.log('New consult record created');
        })
        .catch((err) => {
            console.error('Error on consultCreation',err);
        });
    }
}

module.exports = Consult;
