const express = require('express');
const { login } = require('../../store/firestoreAdmin');
const { auth } = require('firebase-admin');

const router = express.Router();

router.post("/", singIn);


async function singIn (req, res, next) {
    let rol;
    const authUser = {
        email: req.body.email,
        password: req.body.password
    };
    try{  
        const user = await login.singIn( authUser.email, authUser.password);
        console.log(user);
        if (user !== "undefined"){
            console.log(authUser.email);
            rol = await login.returnRol(authUser.email);
            console.log(rol);
            return res.status(200).json({
                code:200,
                message: "Authentication it's ok",
                rol: rol
            });
        } else if (user.code === 404){
            return res.status(404).json({
                code:404,
                message: user.message
            });
        }
    }catch(error){
       return next(error);
    }
}

module.exports = router;