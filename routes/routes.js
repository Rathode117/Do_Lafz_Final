const {Router} = require('express');
const {requireAuth, checkUser}= require('../middleware/Authmiddleware');
const pagecontrol = require('../controller/pagecontrol');
const request = require('request');
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const UserVerification = require('../models/UserVerification');

require("dotenv").config();

const router = Router();






router.get('*', checkUser);
router.get('/profile', requireAuth,pagecontrol.profile);
router.get('/verificationpending', (req,res)=>{
    res.render('pending');
})
router.post('/signup', pagecontrol.signup_post);
router.post('/login', pagecontrol.login_post);
router.get('/', pagecontrol.home);
router.post('/poem', pagecontrol.allpoem_post);
router.get('/poem', pagecontrol.allpoem_get);
router.delete('/poem/:id', pagecontrol.delete_poem);
router.get('/submit', requireAuth, (req,res)=>{
 
    res.render('submit');

    
    
});
router.get('/poem_romantic', pagecontrol.romantic);
router.get('/poem_patriotic', pagecontrol.patriotic);
router.get('/poem_mythology', pagecontrol.mythology);
router.get('/poem_funny', pagecontrol.funny);
router.get('/signup' ,(req,res)=>{
res.render('signup');
})
router.get('/login' ,(req,res)=>{
    res.render('login');
})


router.get("/user/verify/:userId/:uniqueString", (req,res)=>{
    let {userId, uniqueString} = req.params;
    UserVerification
    .find({userId})
    .then((result)=>{
        if(result.length>0){
                    User.updateOne({_id: userId}, {verified:true})
                    .then(()=>{
                        UserVerification.deleteOne({userId})
                        .then(()=>{
                            res.render('verified');
                        })
                        .catch((error)=>{
                            console.log(error);
                        })
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
                }
            })
           
        }
);



router.get("/verified", (req,res)=>{

    res.render('verified');


});
    








module.exports = router;
