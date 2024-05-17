var express = require('express')
var app = express()
var cors = require('cors')
var logger = require('morgan')
var mongoose = require('mongoose')
var axios = require('axios')
var config = require('./config')

const Book = require('./src/models/Book')



////////////////////////////////////////////         라우터
var usersRouter = require('./src/routes/display/userPg')
var commonRouter = require('./src/routes/display/commonPg')
var adminRouter = require('./src/routes/display/adminPg')
var rentalRouter = require('./src/routes/display/rentalPg')

///////////////////////////////////////////////프론트와 연결포트 설정
const corsOptions = {
    origin:'*',
    credentials:true
}



////////////////////////////////////////////// db연결


mongoose.connect(config.MONGODB_URL)
.then(() => console.log('데이터베이스 연동 성공'))
.catch((e) => console.log(`데이터베이스 연결 실패: ${e} `))



/////////////////////////////////////////////  공통 미들웨어
app.use(cors(corsOptions))
app.use(express.json())
app.use(logger('tiny'))

///////////////////////////////////////////          라우터 연결
app.use('/api/users', usersRouter)
app.use('/api/common', commonRouter)
app.use('/api/admin', adminRouter)
app.use('/api/rental', rentalRouter)


///////////////////////////////////////////////////////////////////////////////////////////

app.get('/hello', (req,res) => {
    res.json('hello world!')
})
app.get('/error', (res, req) => {
    throw new Error('에러 발생')
})



///////////////////////////////////////////////////////콜백 핸들러
app.use((req,res,next) => {
    res.status(404).send("Sorry can't find page")            /////////요청 페이지 없을 경우
})

app.use((err, req, res, next) => {                       ////////////서버 내부 에러 발생시
    console.error(err.stack)
    res.status(500).send('something is broken on server!')      
})

app.listen(3400, () => {
    console.log('server is running on port 3400 ...')         //////////////3400포트로 오픈
})