const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
const MongoClient = require('mongodb-legacy').MongoClient;
app.set('view engine','ejs');

const dbURI = 'mongodb+srv://test:FBYxHuq0rCjaUAat@cluster0.nmfbmkk.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

var db
MongoClient.connect(dbURI, (err, client) => {
    if(err) return console.log(err)
    
    db = client.db('todo');
    // db.collection('post').insertOne( {이름 : 'john', 나이: 20}, (err, result) =>{
    //    if(err) return console.log(err)

    //     console.log('저장완료');
    // });

    app.listen(7070, function (req, res) {
        console.log('server 7070 port listening...');
    });

});


app.get('/', function (req, res) {
    // res.sendFile(__dirname + '/index.html')
    res.render('index.ejs')
});

app.get('/write', function (req, res) {
    res.sendFile(__dirname + '/write.html')
});

app.post('/add', function (req, res) {
    res.send('complete')
    console.log(req.body.aa);
    console.log(req.body.bb);

    db.collection('post').insertOne( {제목 : req.body.aa, 날짜 : req.body.bb}, (err, result) =>{
           if(err) return console.log(err) 
            console.log('저장완료');
        });
}); 

app.get('/list', (req, res) =>{
    db.collection('post').find().toArray((err, result)=>{
        console.log(result);
        res.render('list.ejs', {posts : result});
    })
    // res.sendFile(__dirname + '/list.ejs') ejs는 이렇게 안쓴다;
    
});
