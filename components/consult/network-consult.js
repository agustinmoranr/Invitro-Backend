const express = require('express');
const { consults } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post('/', create);

async function create(req, res, next) {
    const consultData = req.body;

    try {
        const consult = await consults.createConsult(consultData);

        return res.status(201).json({
            data: consult, 
            message: 'Exam assigned correctly'
        });
    } catch (error) {
        res.status(400).json({
            data: false, 
            message: 'An error ocurred during consult creation'
        });
        return next(error);
    }
}

module.exports = router;