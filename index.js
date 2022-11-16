const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
const MongoClient = require('mongodb-legacy').MongoClient;
app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://test:FBYxHuq0rCjaUAat@cluster0.nmfbmkk.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

var db
MongoClient.connect(dbURI, (err, client) => {
    if (err) return console.log(err)

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
    // res.send('complete')
    // console.log(req.body.aa);
    // console.log(req.body.bb);

    // db.collection('post').insertOne({ 제목: req.body.aa, 날짜: req.body.bb }, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('저장완료');
    // });
    db.collection('counter').findOne({name : '게시물갯수'}, (err,res)=>{
        console.log(res.totalPost);
        let totalNumberofpost = res.totalPost;

        //게시물에 유니크한 아이디를 부여해서 추가,삭제등의 변경이 일어나도 대응가능
        db.collection('post').insertOne({ _id : totalNumberofpost+1, 제목: req.body.aa, 날짜: req.body.bb }, (err, result) => {
            if (err) return console.log(err)
            console.log('저장완료');
            //mongodb operater = $set, $inc, $min, $rename
            db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1} },(err, res)=>{
                if(err){return console.log(err)}
            });
        });
    });

    return res.redirect('/list');
});

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result) => {
        console.log(result);
        res.render('list.ejs', { posts: result });
    })
    // res.sendFile(__dirname + '/list.ejs') ejs는 이렇게 안쓴다;
});

//게시물 삭제 기능  
app.delete('/delete', (req, res) => {
    console.log(req.body);
    // _id : 1 이 int타입이 아닌 string type으로 전송됨을 해결
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(err, result){
        //vsc ternimal output
        console.log('delete compleated');
        // success 200, fail 400, message from server
        res.status(400).send({message : 'success'});
    })
});

