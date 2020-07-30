const express = require('express');

//instance of consults contoller
const { consults } = require('../../store/firestoreAdmin');

const router = express.Router();

//HTTP Methods
router.post('/:id', create);
router.put('/:id', update);

async function create(req, res, next) {
    const consultData = req.body;
    const userId = req.params.id;

    try {
        const consult = await consults.createConsult(consultData, userId);
        
        return res.status(201).json({
            data: consult,
            message: "Consult created correctly",
            statusCode: res.statusCode
        });
    }
    catch(err) {
        res.status(400).json({
            Error: err.message,
            message: "Error on consult creation.",
            userId: userId,
            statusCode: res.statusCode
        });
        return next(err);
    }
}

async function update(req, res, next) {
    const consultId = req.params.id;
    const newData = req.body;

    try {
        const updatedConsult = await consults.updateConsult(newData, consultId);

        return res.status(201).json({
            data: updatedConsult,
            message: "Consult successfully updated",
            statusCode: res.statusCode
        });
    } 
    catch (error) {
        res.status(400).json({
            Error: error.message,
            message: "An error ocurred during consult updating",
            userId: newData.identityNumber,
            statusCode: res.statusCode
        });
        return next(error);
    }
}


module.exports = router;