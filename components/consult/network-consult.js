const express = require('express');
const { consults } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post('/:id', create);

async function create(req, res, next) {
    const consultData = req.body;
    const id = req.params.id;

    try {
        const consult = await consults.createConsult(consultData, id);
        
        return res.status(201).json({
            data: consult, 
            message: 'Consult created correctly'
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