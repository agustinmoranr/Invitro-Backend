const express = require('express');
const { users } = require('../../store/firestoreAdmin');

const router = express.Router();

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);

async function list (req, res, next) {
    try {
        const typeUsers = await users.listUsers();
        return res.status(201).json({
            Users: typeUsers || {},
            message: 'Users listed correctly'
        });
    } catch (error) {
        return next(error);
    }
}

async function getOne(req, res, next) {
    const identificationCardNumber = req.params.id;
    try {
        const userByIdentificationCard = await users.getUserByIdentification(identificationCardNumber);
        return res.status(201).json({
            User: userByIdentificationCard,
            message: 'User retrieved correctly'
        });
    } catch (error) {
        return next(error.message);
    }
}

async function create(req, res, next) {
    const userData = req.body;
    try {
        const newUser = await users.createUser(userData);
        return res.status(201).json({
            data: newUser,
            message: 'User created correctly'
        });
    } catch (error) {
        res.status(400).json({
            data: false,
            message: 'Error on user creation',
        });
        return next(error);
    }
}

async function update(req, res, next) {
    const identificationCardNumber = req.params.id;
    const newData = req.body;
    try {
        const updatedUser = await users.updateUser(identificationCardNumber, newData);
        return res.status(201).json({
            data: updatedUser,
            message: 'User updated correctly'
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = router;