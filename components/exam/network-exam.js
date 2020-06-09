const express = require('express');
const { exams } = require('../../store/firestore');

const router = express.Router();

router.post('/', create);
router.post('/:id', update);

async function create(req, res, next) {
    const examData = req.body;
    //const idClinicHistory = req.params.id;

    try {
        const exam = await exams.createExam(examData);

        return res.status(201).json({
            data: exam, 
            message: 'Exam created correctly'
        });
    } catch (error) {
        return next(error);
    }
}

async function update(req, res, next) {
    const examId = req.params.id;
    const pdfFile = req.body;

    try {
        const updatedExam = await exams.updateExam(examId, pdfFile);

        return res.status(200).json({
            data: updatedExam,
            message: 'Exam updated correctly'
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = router;