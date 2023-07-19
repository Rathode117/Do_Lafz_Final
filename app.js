const express = require('express');
const {requireAuth, checkUser}= require('./middleware/Authmiddleware');
const ejs = require ('ejs');
const mongoose = require('mongoose');
const Poem = require('./models/Poem');
const Routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;


//instantiating express and setting view engine
const app = express();
app.set('view engine', 'ejs');


//middlewares
app.use(express.static('public'));
app.use(express.static('public/image'));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.use(Routes);


//mongodb connect url
const mongourl = process.env.mongoURL;
mongoose.connect(mongourl)
.then((result)=>app.listen(port))
.catch((err)=> console.log(err));



//applying check user on all routes
app.get('*', checkUser);























// Search Routes

var valofsearch;
var ser;
app.post('/searchresult', (req,res)=>{
    const cate = 'Search';
    valofsearch = req.body.search;
    ser = valofsearch.toLowerCase();
    res.redirect('/searchresult');
    

});

app.get('/searchresult', (req,res)=>{
    const cate = 'Search';
    Poem.find().sort({ createdAt: -1})
    .then((result)=> {
        res.render('searchresult',{cate, ser, poems:result });
    })
    .catch((err)=>{
        console.log(err);
    })


});

app.get('/logout', (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');


});
