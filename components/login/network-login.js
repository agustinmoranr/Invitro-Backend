const express = require('express');
const { login } = require('../../store/firestoreAdmin');

const router = express.Router();

router.post("/", signIn);


async function signIn (req, res, next) {
    let user;
    const authUser = {
        email: req.body.email,
        password: req.body.password
    };

    try{  
        if (authUser.email && authUser.password){
            user = await login.signIn(authUser.email, authUser.password);
                return res.status(201).json({
                    result: user,
                    code: res.statusCode,
                    message: "Authentication it's ok",
                });
        }
        // if you just send a post petition with NO body and params. 
        else {
            user = await login.signOut();
            return res.status(201).json({
                code: res.statusCode,
                message: "User has signed out",
            });
        }
    } catch(error){
        res.status(500).json({
            status: res.statusCode,
            error: error.message
        });
       return next(error);
    }
}

module.exports = router;