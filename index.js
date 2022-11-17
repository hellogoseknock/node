const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

const MongoClient = require('mongodb-legacy').MongoClient;
app.set('view engine', 'ejs');

//form에서 delete 및 put 가능..여기선 put 활용 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//style sheet 파일 등의 static은 /public 밑에 배치
app.use('/pulbic', express.static('public'));

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

// app.get('/write', function (req, res) {
//     res.sendFile(__dirname + '/write.html')
// });

app.get('/write', function (req, res) {
    res.render('write.ejs')
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
        res.status(200).send({message : 'success'});
    })
});

//디테일뷰 /detail/게시물번호 형태로
//:의 의미는 /detail/밑에 아무 문자열이나 오면 res.render() 작동 되게함 == URL parameter
app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        console.log(result);
        res.render('detailPage.ejs', { data : result } )
        // 없는 아이디를 파라미터로 쓴경우 error 처리 필요함
    })
});

//edit
app.get('/edit/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        res.render('edit.ejs', { post : result } )

    })
});

//form을 통한 put 처리
//updateOne 처리가 안되넹...
app.put('/edit', (req, res)=> {
    db.collection('post').updateOne({_id : parseInt(req.body.id)}, { $set : { 제목 : req.body.title, 날짜 : req.body.date }}, function(err, result) {
        console.log('수정완료')
        res.redirect('/list')
    })

});