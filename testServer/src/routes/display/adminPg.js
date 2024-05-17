const express = require('express')
const Book = require('../../models/Book')
const History = require('../../models/History')
const expressAsyncHandler = require('express-async-handler')
// const {isAuth} = require('../../../auth')
const categoryInv = ['웹소설', '자서전', '에세이']

const router = express.Router()

////////////////////////////////////////////////////////신간도서 추가
router.post('/', expressAsyncHandler(async(req,res,next)=>{
    const searchedBook = await Book.find({
        title : req.body.title
    })

    try{
        if(searchedBook.length === 0){

            const inputTitle = req.body.title
            await new Book({
                title : req.body.title,
                summary : Math.random().toString(36).substring(2, 12),
                author : '서보형',
                isbn : Number(req.body.isbn),
                category : categoryInv[Math.floor(Math.random()*(categoryInv.length))],
                amount :  Math.floor(Math.random()*10) + 2 
            }).save()
    
            res.send(`신간도서 ${inputTitle} 등록완료`)
        }else{
            const searchedIsbnBook = await Book.findOne({
                isbn : Number(req.body.isbn),
                title : req.body.title
            })    
                if(!searchedIsbnBook){
                    const inputTitle = req.body.title
                    await new Book({
                        title : req.body.title,
                        summary : Math.random().toString(36).substring(2, 12),
                        author : '서보형',
                        isbn : Number(req.body.isbn),
                        category : categoryInv[Math.floor(Math.random()*(categoryInv.length))],
                        amount :  Math.floor(Math.random()*10) + 2 
                    }).save()
            
                    res.send(`신간도서 ${inputTitle} 등록완료`)
                }else{    
                    res.json('이미 등록된 책입니다.')
                }
            }

    }catch(e){
        res.status.json({
            code:404,
            message:'에러발생'
        })
    }
    
    }
))

/////////////////////////////////////////////////////기존도서 삭제
router.delete('/delete/:title', expressAsyncHandler(async(req,res,next)=>{
    const searchedBook = await Book.findOne({title : req.params.title})
    if(!searchedBook){
        res.status(404).json({
            code : 404,
            message : 'Book Not Founded'
        })
    }else{
        await Book.deleteOne({title : req.params.title})
        res.json('Book was deleted')
    }
}))


///////////////////////////////////////////관리자 통계
router.post('/join/category', expressAsyncHandler(async(req,res,next)=>{
    console.log(req.body.category)

    const history = await History.find({
        category : req.body.category
    })

    if(history){
        console.log(history)
        res.json(history)
    }else{
        res.status(404).json({
            code:404,
            message:'invalid value'
        })
    }
}))

module.exports = router