const express = require('express');
const multer = require('multer');
const { results } = require('../../store/firestoreAdmin');

const router = express.Router();

const PDF = multer({
    //storage: multer.memoryStorage({
        // destination: function (req, res, next) {
        //     next(null, 'temp/pdfs');
        // },
        // filename: function (req, res, next) {
        //     next(null, `${Date.now()}.pdf`);
        // }
    storage: multer.memoryStorage(),
    limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    },
    //})
}).single("sangre");

router.post('/', PDF, uploadPDF);
router.put('/results');

async function uploadPDF(req, res, next) {
    let file = req.file;
    console.log(file);

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

//async function addPDFURL
module.exports = router;