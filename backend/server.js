const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const auth = require('./auth');

const app = express();
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
const loginSchema = new Schema({
   id: String,
   createAt: Date
});

const User = mongoose.model('user', userSchema);
const SURL = mongoose.model('surl', urlSchema);
const Login = mongoose.model('login', loginSchema);


app.get('/', (req, res) => {
    res.send('Hello world!');
});


app.get('/surl/:short', (req, res) => {
    SURL.findOne({short: req.params.short}, (err, doc) => {
        if(err){
            res.status(500);
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
            res.status(500);
            return console.log(err);
        }
        if(doc === null){
            surl.save((err) => {
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
            res.status(500);
            return console.log(err);
        }
        if(doc === null){
            SURL.findOneAndUpdate({_id: _id}, surl,{new: true, useFindAndModify: false},(err, doc) => {
                if(err){
                    res.status(500);
                    return console.log(err);
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
            res.status(500);
            return console.log(err);
        }
        res.json({result : 1, list : doc});
    });
});

app.delete('/surl/delete/:id', (req, res) => {
    SURL.findOneAndDelete({_id: req.params.id}, {}, (err, doc) => {
        if(err){
            res.status(500);
            return console.log(err);
        }
        if(doc === null) res.json({result: 2});
        else res.json({result: 1});
    });
});



app.post('/login', (req, res) => {
    let id = req.body.id;
    let pw = CryptoJS.MD5(req.body.pw).toString();
    User.findOne({id: id, pw: pw}, (err, doc) => {
        if(err){
            res.status(500);
            return console.log(err);
        }
        if(doc !== null){
            let login = new Login({
                id: id,
                createAt: new Date
            });
            login.save((err) => {
                if(err){
                    res.status(500);
                    return console.log(err);
                }
                const accessToken = auth.signToken(id);
                res.json({token : accessToken, result : 1});
            });
        } else{
            res.json({result : 0});
        }
    });

});

app.get('/main/check', (req, res) => {
    let user;
    try {
        user = auth.verify(req.headers.authorization);
    } catch(e){}

    if(!user){
        res.json({result: 0}); // Login first
    }else{
        res.json({result: 1}); // Go to main
    }
});

app.get('/main', auth.ensureAuth(), (req, res) => {
    Login.findOne({id: req.user.id}, (err, doc) => {
        if(err){
            res.status(500);
            return console.log(err);
        }
        res.json({result : 1, logger: doc});
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
            res.status(500);
            return console.log(err);
        }
        if (doc === null) {
            user.save((err) => {
                if(err){
                    res.status(500);
                    return console.log(err);
                }
                res.json({result: 1});
            });
        } else res.json({result: 0});
    });

});


app.listen(5000);
