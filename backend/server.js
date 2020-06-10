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
const User = mongoose.model('user', userSchema);




let getURLFromCode = code => {
//TODO: searching algorithm
};





app.get('/', (req, res) => {
    res.send('Hello world!');
});

//TODO : 데이터베이스 접근, id값에 따른 주소 검색, redirect
app.get('/:id', (req, res) => {
    res.redirect(getURLFromCode(req.params.id));
});

app.post('/login', (req, res) => {

});

app.post('/signup', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    let user = new User({
        id: id,
        pw: CryptoJS.MD5(pw)
    });

    User.findOne({id: id}, (err, doc) => {
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
