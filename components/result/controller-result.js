class Result {
    constructor(db, bucket) {
        this.db = db;
        this.collection = this.db.collection('exam');
        this.bucket = bucket;
    }

    async uploadStorage(file, userId, examId) {

        // file?
        if(!file || !userId || !examId) {
            return "Bad request: Please send a pdf file and other parameters";
        }
        
        //Create new blob using "pdfname" as reference
        const blob = this.bucket.file(file.pdfname);

        // WriteableStream to set it into storage
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            }
        });

        //error?
        blobWriter.on('error', (err) => {
            console.error(err);
            throw new Error('Error uploding your file. Please try sending it again');
        });

        // when 'finish' (consume data event). Define URL
        blobWriter.on('finish', async() => {
            const publicURL = `https://firebasestorage.googleapis.com/v0/b/${
                this.bucket.name
            }/o/${encodeURI(blob.name)}?alt=media`;
            
            console.log(publicURL);

            //update user Exam with new status and URL
            return await this.collection.doc(userId).collection("examsAssigned").doc(examId).update({
                "pdfURL": publicURL,
                "status": true
            })
            .then(() => {
                return console.log("pdfURL actualizado correctamente.");
            })
            .catch((err) => {
                return err, "Error al añadir url";
            });
        });

        // No more data to consumed? Let's "end"
        await blobWriter.end(file.buffer);
        
        return true;
    }
}


module.exports = Result;