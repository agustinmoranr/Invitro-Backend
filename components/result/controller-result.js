class Result {
    constructor(db, bucket) {
        this.db = db;
        this.collection = this.db.collection('exam');
        this.bucket = bucket;
    }
    
    // helper to verify if user and exam exists
    async verifyExamExistence(userId, examId) {
        return await this.collection.doc(userId).collection('examsAssigned').doc(examId).get()
        .then((snapshot) => console.log('examId:', snapshot.data().examId))
        .catch((error) => {
            console.error(error);
            throw new Error('Could not find exam');
        });
    }

    // helper to check if URL was updated to user exam
    async updateExamDocument(userId, examId, publicURL) {
        return await this.collection.doc(userId).collection("examsAssigned").doc(examId).update({
            "pdfURL": publicURL,
            "status": true
        })
        .then(async() => console.log("pdfURL actualizado correctamente."))
        .catch((err) => {
            console.error(err);
            throw new Error('Error updaterror Url and status on user exam Document');
        });
    }

    async uploadStorage(file, userId, examId) {

        // file?
        if(!file || !userId || !examId) {
            throw new Error("Bad request: Please send a pdf file and other parameters");
        }
        
        //check if exam document exist
        await this.verifyExamExistence(userId, examId)
        .then(() => console.log('Exam verified'));

        //Create new blob using "pdfname" as reference
        const blob = await this.bucket.file(file.pdfname);

        // WriteableStream to set it into storage
        const blobWriter = await blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            }
        });

        //error?
        blobWriter.on('error', (err) => {
            console.error(err);
            throw new Error('Error uploding your file');
        });

        //Define URL
        const publicURL = `https://firebasestorage.googleapis.com/v0/b/${
            this.bucket.name
        }/o/${encodeURI(blob.name)}?alt=media`;

        // when 'finish' (consume data event). 
        blobWriter.on('finish', async() => {
            console.log(publicURL);
        });
        
        // No more data to consumed? Let's end
        blobWriter.end(file.buffer);

        //update user Exam with new status and URL
        await this.updateExamDocument(userId, examId, publicURL)
        .then(() => console.log('Exam document updated with pdfURL'));
        
        return {
            userId: userId,
            examId: examId,
            downloadURL: publicURL
        };
        
    }
}

module.exports = Result;
