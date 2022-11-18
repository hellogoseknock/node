const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

const MongoClient = require('mongodb-legacy').MongoClient;
app.set('view engine', 'ejs');

//form에서 delete 및 put 가능..여기선 put 활용 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//인증 - 세션-쿠키 방식 사용
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

//그냥 이렇게 쓰면됨 
app.use(session({secret : '비밀번호', resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());

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
        console.log('server 7070 port listening...')
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
        console.log(res.totalPost)
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

    return res.redirect('/list')
});

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result) => {
        console.log(result)
        res.render('list.ejs', { posts: result })
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
        console.log('delete compleated')
        // success 200, fail 400, message from server
        res.status(200).send({message : 'success'});
    })
});

//디테일뷰 /detail/게시물번호 형태로
//:의 의미는 /detail/밑에 아무 문자열이나 오면 res.render() 작동 되게함 == URL parameter
app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        console.log(result)
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
app.put('/edit', (req, res)=>{
    db.collection('post').updateOne({_id : parseInt(req.body.id)}, { $set : { 제목 : req.body.title, 날짜 : req.body.date }}, function(err, result) {
        console.log('수정완료')
        res.redirect('/list')
    })

});


// 세션(쿠키)방식 인증 처리
// 로그인 폼을 서버로 넘기기전에
app.post('/login',passport.authenticate('local', {failureRedirect : '/fail'}), (req, res)=>{
    res.redirect('/')
})

// 먼저 로그인 페이지를 보여줘야겠지
app.get('/login', (req, res)=>{
    res.render('login.ejs')
})

// 인증 실패시 
app.get('/fail', (req, res)=>{
    console.log('failed')
})

//패스포트가 검증 당담
passport.use(new LocalStrategy({
    usernameField : 'id',   // 로그인 폼의 name 속성에 기반
    passwordField : 'pw',
    session : true,
    passReqToCallback : false,
}, (inputID,inputPW, done)=>{
    console.log(inputID, inputPW)

    db.collection('login').findOne({id : inputID}, function(err, result){
        if(err) return done(err)

        //db에서 찾은 아이디가 없으면 처리 먼저, 아이디가 있는경우 패스워드를 순차적으로 확인
        //보안처리(문자열의 경우 해시 처리 필요)는 안되어 있음
        //done( 서버에러, 성공시 사용자 DB데이터, 에러메시지 )
        if(!result) return done(null, false, {message : '존재하지 않는 아이디에요'})
        if(inputID == result.pw){
            return done(null, result)
        } else {
            return done(null, false, {message : '비번이 틀렸어요'})
        }
    })
}));

// 아이디 비번이 맞으면 세션을 하나 만들어서 로컬(웹브라우져)에 저장(유지)필요
// 추가로 세션 데이터 생성후 세션의 id 정보를 쿠키로 보냄
passport.serializeUser( (user, done)=>{
    done(null, user.id)
});

// 세션이 있어야 마이페이지에 방문했을때 확인(세션검사)후 페이지 전송키켜 주려면
// 로그인한 유저의 정보들을 DB에서 찾는 역활 
passport.deserializeUser( (id, done)=>{
    //db에서 user.id로 유저를 찾은 뒤에 유저정보를 { }에 넣음
    db.collection('login').findOne({id : 아이디}, (err, result)=>{
        done(null, result)
    })
});

// mypages 접근 및  커스텀 미들웨어 쓰는법
app.get('/mypage', areYouLogedIn, (req, res) =>{
    res.render('mypages.ejs')
});

//mypage 접근전 로그인검사 middleware
function  areYouLogedIn( req, res, next){
    if(req.user){
        next()
    } else {
        res.send('Access Denied')
    }
};