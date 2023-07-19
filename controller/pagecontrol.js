const Poem = require('../models/Poem');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const request = require('request');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const {v4 : uuidv4} = require('uuid');
const UserVerification = require('../models/UserVerification');
require("dotenv").config(); 



//validation error handling
const handleErrors = (err)=>{
    let error = {name: '', email: '', password: '', verified: ''};
    if(err.code===11000){
        error.email='Email already exists';    //for duplicate emails
        return error;
    }

    if(err.message==='incorrect password'){
        error.password='Incorrect Password, try again';  //loging in with wrong password
        return error;
    }

    if(err.message==='incorrect email'){
        error.email='user email not found';      //logging in with wrong email
        return error;
    }
    if(err.message==='Account not verified'){
        error.verified='Account not Verified';      //logging in with wrong email
        return error;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{     //while signing up if validations fail
        error[properties.path]=properties.message;
        
        
    });
    return error;
    }

}

//making jwt token and setting age in seconds
const maxAge = 3*26*60*60;   //3 days
const createToken = (id)=>{
    return jwt.sign({id}, 'mysecretkeyforcookie',{ 
        expiresIn: maxAge
    });
}






let transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: process.env.AUTH_EMAIL,   
        pass: process.env.AUTH_PASS
    },
});

const sendVerificationEmail = (user) =>{        
    const currentUrl = "https://long-cyan-wildebeest-boot.cyclic.app";
    const uniqueString = uuidv4()+user._id;


    let mailOptions  =  {
        from: `"Do Lafz" <dolafzverify@gmail.com>`,
        to: user.email,
        subject: "Verify Your Email",
        html: `<p> verify your email address.<a href= "${currentUrl+"/user/verify/"+ user._id+"/"+uniqueString}">Click here<a/></p>`
    };

        const newVerification = new UserVerification({
            userId: user._id,
            uniqueString: uniqueString,
        });

        newVerification
        .save()
        .then(()=>{
             transporter
            .sendMail(mailOptions)
            .then()
            .catch((error)=>{
                console.log(error);
            })


        })
        .catch((error)=>{
            console.log(error);


        })
    };














//Sign up POST Page controller
module.exports.signup_post = async (req,res)=>{
    const{ name, email, password}= req.body;
    try{
        const user = await User.create({name,email,password, verified: true});
        sendVerificationEmail(user);
        res.status(201).json({user:user._id});


        

    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});

    }

}


//login POST page controller


module.exports.login_post = async (req,res)=>{
    const{email, password}= req.body;
    try{
        const user = await User.login(email,password);
        if(user.verified==true){
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
        }

        
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});

    }

}



module.exports.profile=(req,res)=>{
    Poem.find().sort({ createdAt: -1})
            .then((result)=> {
                res.render('profile', {poems:result});
            })
            .catch((err)=>{
                console.log(err);
            })
};




// home page controller

module.exports.home = (req,res)=>{
    Poem.find().sort({ createdAt: -1})
        .then((result)=>{
            res.render('index',{poems:result});
        })
        .catch((err)=>{
            console.log(err);
        })
}




// All poems page controller

module.exports.allpoem_post = (req,res)=>{
    const poem1 = new Poem(req.body);
    poem1.save()
        .then((result)=>{
            res.redirect('/poem');
        })
        .catch((err)=>{
            console.log(err);
        })


};


module.exports.allpoem_get = (req,res)=>{

    Poem.find().sort({ createdAt: -1})
            .then((result)=> {
                res.render('poem', {poems:result});
            })
            .catch((err)=>{
                console.log(err);
            })
    
};
module.exports.delete_poem = (req,res)=>{
    const id = req.params.id;
    Poem.findByIdAndDelete(id)
        .then(result =>{
            res.json({redirect : '/profile'})
        })
        .catch(err=>{
            console.log(err);
        })

   
    
}








// submit page controlller

// module.exports.submit = (req,res)=>{
//     res.render('submit');
// };






// Categories Controller


module.exports.romantic =(req,res)=>{
    const cate = 'Romantic';
    Poem.find().sort({ createdAt: -1})
            .then((result)=> {
                res.render('poem_romantic', {poems:result, cate});
            })
            .catch((err)=>{
                console.log(err);
            })

};

module.exports.patriotic = (req,res)=>{
    const cate = 'Patriotic';
    Poem.find().sort({ createdAt: -1})
            .then((result)=> {
                res.render('poem_patriotic', {poems:result, cate});
            })
            .catch((err)=>{
                console.log(err);
            })

};

module.exports.funny = (req,res)=>{
    const cate = 'Funny';
    Poem.find().sort({ createdAt: -1})
            .then((result)=> {
                res.render('poem_funny', {poems:result, cate});
            })
            .catch((err)=>{
                console.log(err);
            })

};


module.exports.mythology = (req,res)=>{
    const cate = 'Mythology';

    Poem.find().sort({ createdAt: -1})
            .then((result)=> {
                res.render('poem_mythology', {poems:result, cate});
            })
            .catch((err)=>{
                console.log(err);
            })

};






// module.exports.verifypage = (req,res)=>{
//     let {userId, uniqueString} = req.params;
//     UserVerification
//     .find({userId})
//     .then((result)=>{
//         if(result.length>0){
//             const hashedUniqueString=result[0].uniqueString;
//             bcrypt.compare(uniqueString, hashedUniqueString)
//             .then(result=>{
//                 if(result){
//                     User.updateOne({_id: userId}, {verified:true})
//                     .then(()=>{
//                         UserVerification.deleteOne({userId})
//                         .then(()=>{
//                             res.render('verified');
//                         })
//                         .catch((error)=>{
//                             console.log(error);
//                         })
//                     })
//                     .catch((error)=>{
//                         console.log(error);
//                     })
//                 }
//                 else{
//                     console.log(error);
//                 }
//             })
//             .catch((error)=>{
//                 console.log(error);
//             })
//         }
//         else{
//             console.log("failed");
//         }


//     })
//     .catch((error)=>{
//         console.log(error);
//     })

// };
