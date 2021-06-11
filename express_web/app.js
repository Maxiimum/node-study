const express = require('express'); // 익스프레스 내부에 http 모듈 내장
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv'); // .env파일을 읽어서 process.env로 만듬.
const path = require('path'); // 파일 경로를 path모듈을 사용해서 지정.

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());                            // body-parser를 따로 설치할 필요없다. 4.16.0 버전 express부터 내장
app.use(express.urlencoded({ extended: false }));   // 단, Raw, Text 형식의 데이터를 처리할 땐 body-parser설치
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie', // 기본 이름 connect.sid
}));

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

app.get('/', (req, res, next) => {   // app.get(주소, 라우터)
    console.log('GET / 요청에서만 실행됩니다.' )
    next();
    //res.sendFile(path.join(__dirname, '/index.html')); // 익스프레스에서는 res.write 나 res.end 대신 res.send 사용.
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), '번 포트에서 대기중');
});
