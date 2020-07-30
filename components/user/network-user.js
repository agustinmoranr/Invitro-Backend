const express = require('express');

//instance of users contoller
const { users } = require('../../store/firestoreAdmin');

const router = express.Router();

//HTTP methods
router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);

async function list (req, res, next) {
    try {
        const typeUsers = await users.listUsers();
        return res.status(201).json({
            Users: typeUsers || {},
            message: 'Users listed correctly',
            statusCode: res.statusCode
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            statusCode: res.statusCode,
            message: 'Please, try get data again'
        });
        return next(error);
    }
}

async function getOne(req, res, next) {
    const identityNumber = req.params.id;
    try {
        const userById = await users.getUserByIdentification(identityNumber);
        return res.status(201).json({
            User: userById,
            message: 'User retrieved correctly',
            statusCode: res.statusCode
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            statusCode: res.statusCode,
            message: 'Please, try get user again'
        });
        return next(error.message);
    }
}

async function create(req, res, next) {
    const userData = req.body;
    try {
        const newUser = await users.createUser(userData);
        return res.status(201).json({
            data: newUser,
            message: 'User created correctly',
            statusCode: res.statusCode
        });
    } catch (error) {
        res.status(400).json({
            data: false,
            message: 'Error on user creation',
            statusCode: res.statusCode
        });
        return next(error);
    }
}

async function update(req, res, next) {
    let updatedUser;
    const identityNumber = req.params.id;
    const newData = req.body;
    
    try {
        if(newData.identityNumber) {
            throw new Error('Is not posible to update identityNumber from user');
        }
        else if(typeof newData.disabled !== 'undefined' || null && newData.email){
            updatedUser = await users.ableAndDisableUser(identityNumber, newData);
        }
        else if(newData.currentEmail && newData.newEmail) {
            updatedUser = await users.changeEmail(identityNumber, newData);
        }
        else {
            updatedUser = await users.updateUserInfo(identityNumber, newData);
        }
        return res.status(201).json({
            result: updatedUser,
            statusCode: res.statusCode,
            message: 'User updated correctly'
        });
    } catch (error) {
        res.status(400).json({
            Error: error.message,
            message: 'Error on user updating',
            statusCode: res.statusCode
        });
        return next(error);
    }
}

module.exports = router;