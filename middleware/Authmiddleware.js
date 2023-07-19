const jwt = require('jsonwebtoken');
const Poem = require('../models/Poem');
const User = require('../models/User');



//middle ware to add to pages to give only authorized access
const requireAuth = (req,res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'mysecretkeyforcookie',(err,decodedToken)=>{
            if(err){
                res.redirect('/login');
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}



const checkUser =  (req,res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'mysecretkeyforcookie',async(err,decodedToken)=>{
            if(err){
                res.locals.user=null;
                next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                res.locals.user =user;
                next();
            }
        })
    }
    else{
        res.locals.user=null;
        next();
    }
}


module.exports = {requireAuth, checkUser};
