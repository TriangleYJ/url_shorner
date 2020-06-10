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
    short: String,
    url: String,
    author: String,
});

const User = mongoose.model('user', userSchema);
const SURL = mongoose.model('surl', urlSchema);









app.get('/', (req, res) => {
    res.send('Hello world!');
});


app.get('/surl/:short', (req, res) => {
    SURL.findOne({short: req.params.short}, (err, doc) => {
        if(err){
            res.json({result : -1});
            return console.log(err);
        }
        if(doc !== null){
            res.json({result : 1, url : doc.url});
        } else {
            res.json({result : 0});
        }
    });
});


app.post('/surl/add', (req, res) => {
    let short = req.body.short;
    let url = req.body.url;
    let author = req.body.author;
    let surl = new SURL({
        short: short,
        url: url,
        author: author
    });
    SURL.findOne({short: short}, (err, doc) => {
        if(err){
            res.json({result : -1});
            return console.log(err);
        }
        if(doc === null){
            surl.save((err, i) => {
                if(err){
                    res.json({result: -1});
                    return console.error(err);
                }
                res.json({result: 1});
            });
        } else res.json({result: 0});
    });
});

app.put('/surl/edit', (req, res) => {
    let short = req.body.short;
    let url = req.body.url;
    let author = req.body.author;
    let _id = req.body._id;
    let surl = new SURL({
        short: short,
        url: url,
        author: author,
        _id: _id
    });
    SURL.findOne({short: short}, (err, doc) => {
        if(err){
            res.json({result: -1});
            return console.error(err);
        }
        if(doc === null){
            SURL.findOneAndUpdate({_id: _id}, surl,{new: true, useFindAndModify: false},(err, doc) => {
                if(err){
                    res.json({result: -1});
                    return console.error(err);
                }
                if(doc === null) res.json({result: 2});
                else res.json({result: 1});
            });
        } else res.json({result: 0});
    });

});

app.post('/surl/get', (req, res) => {
    SURL.find({author: req.body.author}, (err, doc) => {
        if(err){
            res.json({result : -1});
            return console.log(err);
        }
        res.json({result : 1, list : doc});
    });
});

app.delete('/surl/delete/:id', (req, res) => {
    SURL.findOneAndDelete({_id: req.params.id}, {}, (err, doc) => {
        if(err){
            res.json({result: -1});
            return console.error(err);
        }
        if(doc === null) res.json({result: 2});
        else res.json({result: 1});
    });
});



app.post('/login', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    User.findOne({id: id, pw: CryptoJS.MD5(pw)+""}, (err, doc) => {
        if(err){
            res.json({result : -1});
            return console.log(err);
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
        if (err) {
            res.json({result: -1});
            return console.log(err);
        }
        if (doc === null) {
            user.save((err, i) => {
                if (err) {
                    res.json({result: -1});
                    return console.error(err);
                }
                res.json({result: 1});
            });
        } else res.json({result: 0});
    });

});


app.listen(5000);
