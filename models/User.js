const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;




const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'please enter a valid name']

    },
    email:{         
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,   //cannot have custom mesage like required or validate or minlength
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a Password'],
        minlength: [8, 'Minimum length should be 8']
    },
    verified: {
        
        type: Boolean
    }
   
});

//password hash function using moongose hook
userSchema.pre('save', async function (next){    // using pre mongoose hook
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);  //hashing the password using bcrypt
    next();

});


//creating static login method

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
   
    if(user){
        const auth = await bcrypt.compare(password, user.password);  //comparing given and saved password for a user
        
        if(auth){
            if(user.verified==false){
                throw Error('Account not verified');
            }
            else{
                return user;   //if right pasword returning user
            }
           
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');

}










const User = mongoose.model('user', userSchema); //if name of collection is plural of User i.e., Users
module.exports=User;