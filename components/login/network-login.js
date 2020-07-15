const express = require('express');
const { login } = require('../../store/firestore');

const router = express.Router();

router.post("/", singIn)


async function singIn (req, res, next) {
    const authUser = {
        email: req.body.email,
        password: req.body.password
    }
    try{  
        const rol = await login.returnRol(authUser.email);           
        console.log(rol)
        const user = await login.singIn( authUser.email, authUser.password);        
        if (user.code == 200){
            res.status(200).json({
                code:200,
                message: "Authentication it's ok",
                rol: rol
            })
        }else if (user.code == 404){
            res.status(404).json({
                code:404,
                message: user.message
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = router;