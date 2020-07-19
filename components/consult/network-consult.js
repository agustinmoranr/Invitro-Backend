const express = require('express');
const { consults } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post('/:id', create);

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

module.exports = router;