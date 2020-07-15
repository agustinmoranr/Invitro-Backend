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
    const identificationNumber = req.params.id;
    try {
        const userById = await users.getUserByIdentification(identificationNumber);
        return res.status(201).json({
            User: userById,
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
    let updatedUser;
    const identificationNumber = req.params.id;
    const newData = req.body;
    
    try {
        if(newData.identityCard) {
            throw new error('Is not posible to update identityCard from user, please create another user');
        }
        else if(typeof newData.disabled !== 'undefined' || null && newData.email){
            updatedUser = await users.ableAndDisableUser(identificationNumber, newData);
        }
        else if(newData.currentEmail && newData.newEmail) {
            updatedUser = await users.changeEmail(identificationNumber, newData);
        }
        else {
            updatedUser = await users.updateUserInfo(identificationNumber, newData);
        }
        return res.status(201).json({
            data: updatedUser,
            message: 'User updated correctly'
        });
    } catch (error) {
        res.status(400).json({
            data: false,
            message: 'Error on user updating'
        });
        return next(error);
    }
}

module.exports = router;