const firebase = require('firebase-admin');
// const firebase = require("firebase/app");
// require("firebase/storage");

// const { firebaseSimple } = require('../../config/firebaseConfig');

// firebase.initializeApp(firebaseSimple);

class Exams {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
        //this.storage = firebase.storage();
    }

    async assignExam(data) {
        // isMedic?
        //1 get typeExam
        //update data
        // insert in pacient clinichistory
        let clinicDocument = []
        let uid = data.identityCard;

        const consultData = {
            consult: {
                //date: new Date(),
                aditionalData: data.aditionalData || null,
                indications: data.indications
            },
            exam: {
                typeExam: data.type || null,
                status: "pending",
                results: null,
            } || null
            //aditionalNotes: null,
        };

        // const exam = await this.collection.where('typeExam', '==', data.type).get()
        // .then((snapshot) => {
        //     let exam
        //     snapshot.forEach((doc) => {
        //         //console.log(doc.data())
        //         exam = {typExam: doc.data(), }
        //         return exam
        //     })
        //     return exam
        // })
        // .catch((err) => {
        //     console.error(err)
        // })
        // console.log(exam)
        
        // const clinicDoc = await this.db.collection('clinicHistory').where('identityCard', '==', uid).get()
        // .then((snapshot) => {
        //     let consults
        //     snapshot.forEach(async (doc) => {
        //         //console.log(doc)
        //         //console.log(doc.data())
        //         consults = doc.data().identityCard
        //         //return consults
        //     })
        //     return consults
        // })
        // .catch((err) => {
        //     console.error(err)
        // })
        // console.log(clinicDoc);
        let date = new Date();
        let id = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        let idString = id.toString();
        console.log(idString)
        let setExam = await this.db.collection('clinicHistory').doc(uid).collection('consults').doc(idString).set(consultData)
        .then(() => {
            return console.log('New consult record created')
        })
        .catch((err) => {
            console.error('Error on consultCreation',err);
        })
        console.log(setExam)
        
        return setExam //clinicDocument;
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
