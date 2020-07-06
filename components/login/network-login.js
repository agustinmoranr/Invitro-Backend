const express = require('express');
const { login } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post("/", singIn)


async function singIn (req, res, next) {
    const authUser = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        const user = await login.singIn(authUser.email, authUser.password);
        res.status(201).json({
            data: authUser,
            message: 'User created correctly'
        })
        console.log(user) 
    }catch(error){
        next(error)
    }
}

module.exports = router;