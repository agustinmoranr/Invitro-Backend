const express = require('express');
const { exams } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post('/:id', create);

async function create(req, res, next) {
    const examData = req.body;
    const id = req.params.id;

    try {
        const exam = await exams.createExam(examData, id);
        
        return res.status(201).json({
            data: exam, 
            message: 'Exam created correctly'
        });
    } catch (error) {
        res.status(400).json({
            data: false, 
            message: 'An error ocurred during exam creation'
        });
        return next(error);
    }
}

module.exports = router;