const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const bookSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : true
    },
    release : {
        type : Date,
        default : Date.now()
        // required : true
    },
    author : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
   
    rental : {                           /////////////////////재고소진시 true ㅇㅇ
        type : Boolean,                            
        required : true,
        default : false
    },
    amount : {
        type : Number,
        required : true        
    },
    isbn : {
        type : Number,
        required : true,
        unique:true
    }
})


const Book = mongoose.model('Book', bookSchema)


/////////////////////////////////////////////////////////////////// book 데이터 검증

// 제목
// bookSchema.path('title').validate(function(value){
//     return /[a-zA-Z0-9]{1,15}/.test(value)
// },'title `{VALUE}` (은)는 잘못된 제목 형식입니다.')

// 양
bookSchema.path('amount').validate(function(value){
    return value > 0 && value < 200
},'amount `{VALUE}` 는 잘못된 수량 형식입니다.' )

// 글쓴이
bookSchema.path('author').validate(function(value){
    return /[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{1,15}/.test(value)
},'author `{VALUE}` 는 잘못된 작가 형식입니다.' )


module.exports = Book




const bookInv = ['해리포터','반지의 제왕','원피스','수레바퀴 아래서', '크눌프', '싯다르타', '데미안', '1984', '광장', '유리알 유희']
const categoryInv = ['웹소설', '자서전', '에세이']


////////////////////////////////////////////////////////////도서목록 생성코드
// for(let i = 0; i<bookInv.length; i++){
//     const book = new Book({
//         title : bookInv[i],
//         summary : Math.random().toString(36).substring(2, 12),
//         author : '서보형',
//         category : categoryInv[Math.floor(Math.random()*(categoryInv.length))],
//         amount :  Math.floor(Math.random()*10) + 2 ,
//         isbn : i
//     })

//     book.save().then(() => console.log('책 등록완료'))
// }