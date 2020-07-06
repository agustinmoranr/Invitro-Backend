class Result {
    constructor(db, storage) {
        this.db = db;
        this.collection = this.db.collection('clinicHistory');
        this.storage = storage;
        //this.storage.ref = this.storage.ref('/pdfExams')
    }

    async uploadStorage(file) {
        if(!file) {
            return "You didn't select a file";
        }
        await this.storage.ref(file.originalname).put(file.buffer)
        .then(() => {
            return console.log("Pdf uploaded correctly");
        })
        .catch((err) => {
            return console.error(err);
        });

        return await this.collection.doc("querycollections").collection("consults").doc("2-7-2020-18:11:43").update({
            "exam.pdfURL": file.originalname,
            "exam.status": "completed"
        })
        .then(() => {
            return console.log("pdfURL actualizado correctamente.");
        })
        .catch((err) => {
            return err, "Error al añadir url";
        });

        //console.log(file);
        //let storageRef = this.storage.ref(file);
    }
}


module.exports = Result;