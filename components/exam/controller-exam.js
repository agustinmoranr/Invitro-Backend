//const firebase = require('firebase-admin');
const firebase = require("firebase/app");
require("firebase/storage");

const { firebaseSimple } = require('../../config/firebaseConfig');

firebase.initializeApp(firebaseSimple);

class Exams {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
        //this.storage = firebase.storage();
    }

    async createExam(data, id) {
        // isMedic?

        const examData = {
            //dateCreate: firebase.firestore.Timestamp.fromDate(new Date("DD/MM/YYYY")),
            date: null,
            //idClinicHistory: this.db.collection('clinicHistory').doc(id),
            //idUser: this.db.collection('user').doc('123'),
            status: "pending",
            results: null,
            indications: null,
            aditionalNotes: null,
            typeExam: data.name
        };

        const newExam = await this.collection.doc(examData.typeExam).set(examData);
        console.log(newExam);
        return newExam; 
    }

    async updateExam(idExam, pdfFile) {
        // is bactereologist?
        var storageRef = firebase.storage().ref('pdfExams' + 'hola.pdf');
        console.log(pdfFile);
        console.log(idExam);
        const uploadPdf = await storageRef.put(pdfFile);
        uploadPdf
        .then(() => {
            console.log("pdf created on storage");
            return uploadPdf.snapshot.ref.getDownloadURL().then((downloadURL) => {
                return console.log('File available at: ', downloadURL);
            });
        })
        // Upload completed successfully, now we can get the download URL
        
        .catch((err) => {
            return console.log('error on pdf uploading', err);
        });
        return uploadPdf;
    }
}

module.exports = Exams;
