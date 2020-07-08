const { nanoid } = require("nanoid");

class Result {
    constructor(db, storage, bucket) {
        this.db = db;
        this.collection = this.db.collection('clinicHistory');
        this.bucket = bucket;
    }

    async uploadStorage(file) {
        let data = [];

        // file?
        if(!file) {
            return "You didn't select a file";
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
            return console.error(err);
        });

        // when 'finish' (consume data event). Define URL
        blobWriter.on('finish', async() => {
            const publicURL = `https://firebasestorage.googleapis.com/v0/b/${
                this.bucket.name
            }/o/${encodeURI(blob.name)}?alt=media`;
            
            console.log(publicURL);

            //update user Exam with new status and URL
            await this.collection.doc("querycollections").collection("consults").doc("7-7-2020-1:27:29").update({
                "JTMI76qeJj52Hly1z3mGF.pdfURL": publicURL,
                "JTMI76qeJj52Hly1z3mGF.status": "completed"
            })
            .then(() => {
                return console.log("pdfURL actualizado correctamente.");
            })
            .catch((err) => {
                return err, "Error al añadir url";
            });
            
            return data.push({
                filename: file.originalname,
                pdfURL: publicURL
            });
        });

        // No more data to consumed? Let's "end"
        await blobWriter.end(file.buffer);
        
        return data;
    }
}


module.exports = Result;