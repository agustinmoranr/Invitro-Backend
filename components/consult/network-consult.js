const express = require('express');
const { consults } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post('/', create);
//router.post('/:id', update);

async function create(req, res, next) {
    const consultData = req.body;
    //const idClinicHistory = req.params.id;

    try {
        const consult = await consults.createConsult(consultData);

        return res.status(201).json({
            data: consult, 
            message: 'Exam assigned correctly'
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = router;