const firebase = require('firebase-admin');

class Exams {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
        this.storage = firebase.storage().ref;
    }

    async createExam(data, id) {
        // isMedic?

        const examData = {
            dateCreate: firebase.firestore.Timestamp.fromDate(new Date()),
            idClinicHistory: this.db.collection('clinicHistory').doc(id),
            idUser: this.db.collection('user').doc('123'),
            status: "pending",
            pdfId: "",
            indications: data.indications,
            aditionalNotes: data.aditionalNotes,
            typeExam: {
                idTypeExam: 'sdasdassda',
                name: data.typeExam.name
            }
        };

        const newExam = await this.collection.doc().set(examData);
        console.log(newExam);
        return newExam; 
    }

    async updateExam(idExam, pdfFile) {
        // is bactereologist?
        console.log(pdfFile);
        console.log(idExam);
        const uploadPdf = await this.storage.child('pdfExams/' + pdfFile.name).put(pdfFile);
        uploadPdf
        .then(() => {
            console.log("pdf created on storage");
            return uploadPdf.snapshot.ref.getDownloadURL();
        })
        // Upload completed successfully, now we can get the download URL
        .then((downloadURL) => {
            return console.log('File available at: ', downloadURL);
        })
        .catch((err) => {
            return console.log('error on pdf uploading', err);
        });
        return uploadPdf;
    }
}

module.exports = Exams;
