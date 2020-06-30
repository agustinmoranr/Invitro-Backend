const firebase = require('firebase-admin');
// const firebase = require("firebase/app");
// require("firebase/storage");

// const { firebaseSimple } = require('../../config/firebaseConfig');

// firebase.initializeApp(firebaseSimple);

class Consult {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('exams');
        //this.storage = firebase.storage();
    }
    
    
    async createConsult(data) {
        let uid = data.identityCard;
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
        else {
            consultData = {
                consult: {
                    date: new Date(),
                    aditionalData: data.aditionalData || null,
                    indications: data.indications
                },
                exam: {
                    typeExam: data.type,
                    status: "pending",
                    results: null,
                }
            };
        }

        return await this.db.collection('clinicHistory').doc(uid).collection('consults').doc(dateId).set(consultData)
        .then(() => {
            return console.log('New consult record created');
        })
        .catch((err) => {
            console.error('Error on consultCreation',err);
        });
    }

//     async updateExam(idExam, pdfFile) {
//         // is bactereologist?
//         var storageRef = firebase.storage().ref('pdfExams' + 'hola.pdf');
//         console.log(pdfFile);
//         console.log(idExam);
//         const uploadPdf = await storageRef.put(pdfFile);
//         uploadPdf
//         .then(() => {
//             console.log("pdf created on storage");
//             return uploadPdf.snapshot.ref.getDownloadURL().then((downloadURL) => {
//                 return console.log('File available at: ', downloadURL);
//             });
//         })
//         // Upload completed successfully, now we can get the download URL
        
//         .catch((err) => {
//             return console.log('error on pdf uploading', err);
//         });
//         return uploadPdf;
//     }
 }

module.exports = Consult;
