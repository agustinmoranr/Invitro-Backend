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
}).single("results");

router.post('/:id', PDF, uploadPDF);

async function uploadPDF(req, res, next) {

    //adding pdfname to set it as the filename on storage
    Object.defineProperty(req.file, 'pdfname', {
        value: `${nanoid()}.pdf`,
        writable: true,
        enumerable: true,
        configurable: true
    });

    let file = req.file;
    let userId = req.params.id;
    let examId = req.body.examId;

    try {
        const upload = await results.uploadStorage(file, userId, examId);

        return res.status(201).json({
            data: upload,
            message: "File upload correctly to store"
        });
    } catch (error) {
        res.status(500).json({
            data: false,
            message: "An error ocurred. Please try sending your file again"
        });
        return next(error);
    }
}

module.exports = router;