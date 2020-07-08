const express = require('express');
const multer = require('multer');
const { results } = require('../../store/firestoreAdmin');
const { nanoid } = require('nanoid');

const router = express.Router();

//middleware to get a file using multer
const PDF = multer({
    storage: multer.memoryStorage(),
    limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    },
}).single("sangre");

router.post('/', PDF, uploadPDF);

async function uploadPDF(req, res, next) {
    //adding pdfname to set it as the filename on storage
    Object.defineProperty(req.file, 'pdfname', {
        value: `${nanoid()}.pdf`,
        writable: true,
        enumerable: true,
        configurable: true
    });

    let file = req.file;
    
    try {
        const upload = await results.uploadStorage(file);
        return res.status(201).json({
            file: upload,
            message: "File upload correctly to store"
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = router;