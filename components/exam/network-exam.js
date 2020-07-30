const express = require('express');

//instance of exams contoller
const { exams } = require('../../store/firestoreAdmin');

const router = express.Router();

//HTTP Methods
router.post('/:id', create);

async function create(req, res, next) {
    const examData = req.body;
    const userId = req.params.id;

    try {
        const exam = await exams.createExam(examData, userId);
        
        return res.status(201).json({
            result: exam, 
            message: 'Exam created correctly',
            statusCode: res.statusCode
        });
    } 
    catch (error) {
        res.status(400).json({
            Error: error.message, 
            message: 'An error ocurred during exam creation',
            userId: userId,
            statusCode: res.statusCode
        });
        return next(error);
    }
}

module.exports = router;