const express = require('express');
const { consults } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post('/:id', create);
router.put('/:id', update);

async function create(req, res, next) {
    const consultData = req.body;
    const userId = req.params.id;

    try {
        const consult = await consults.createConsult(consultData, userId);
        
        return res.status(200).json({
            data: consult,
            message: "Consult created correctly"
        });
    }
    catch(err) {
        res.status(400).json({
            data: false,
            message: "Error on consult creation.",
            userId: userId 
        });
        return next(err);
    }
}

async function update(req, res, next) {
    consultId = req.params.id;
    newData = req.body;

    try {
        const updatedConsult = await consults.updateConsult(newData, consultId);

        return res.status(201).json({
            data: updatedConsult,
            message: "Consult successfully updated"
        });
    } 
    catch (error) {
        res.status(400).json({
            data: false,
            message: "An error ocurred during consult updating",
            userId: userId
        });
        return next(error);
    }
}


module.exports = router;