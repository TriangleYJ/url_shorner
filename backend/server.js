const express = require('express');

const app = express();


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


app.listen(5000);
