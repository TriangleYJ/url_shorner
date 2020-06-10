const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const CryptoJS = require('crypto-js');

const Schema = mongoose.Schema;

app.use(bodyParser.json());
app.use(cors());

// CONNECT TO MONGODB SERVER
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_urlshortner', { useNewUrlParser: true , useUnifiedTopology: true} );
const userSchema = new Schema({
    id: String,
    pw: String
});
const urlSchema = new Schema({
    shortened: String,
    url: String,
    author: String,
});

const User = mongoose.model('user', userSchema);
const SURL = mongoose.model('surl', userSchema);




let getURLFromCode = code => {
//TODO: searching algorithm
};





app.get('/', (req, res) => {
    res.send('Hello world!');
});

//TODO : 데이터베이스 접근, id값에 따른 주소 검색, redirect
app.get('/surl/:id', (req, res) => {
    //res.send(getURLFromCode(req.params.id));
/*    setTimeout(() => {
        res.json({result:1, url:"https://naver.com"});
    }, 2000);*/
});

app.post('/login', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    User.findOne({id: id, pw: CryptoJS.MD5(pw)+""}, (err, doc) => {
        if(err){
            console.log(err);
            res.json({result : -1});
            return;
        }
        if(doc !== null){
            //Authentication is too hard for me
            res.json({result: 1, id: id, nickname: id.split("@")[0]});
        } else{
            res.json({result: 0});
        }
    });

});

app.post('/signup', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    let user = new User({
        id: id,
        pw: CryptoJS.MD5(pw)
    });

    User.findOne({id: id}, (err, doc) => {
        if(err){
            console.log(err);
            res.json({result : -1});
            return console.error(err);
        }
        if(doc === null){
            user.save((err, user) => {
                if(err){
                    res.json({result: -1});
                    return console.error(err);
                }

                res.json({result: 1});
            });
        }
        else res.json({result: 0});
    });

});


app.listen(5000);
