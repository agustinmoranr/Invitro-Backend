const express = require('express');

//instance of login contoller
const { login } = require('../../store/firestoreAdmin');

const router = express.Router();

//HTTP Methods
router.post("/", signIn);

async function signIn (req, res, next) {
    let user;
    const email = req.body.email;
    const password = req.body.password;

    try{  
        if (email && password){
            user = await login.signIn(email, password);
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
            user: email,
            error: error.message,
            status: res.statusCode,
        });
       return next(error);
    }
}

module.exports = router;