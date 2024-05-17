const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const Book = require('../../models/Book')
const User = require('../../models/User')
const History = require('../../models/History')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const router = express.Router()

//////////////////////////////////////////////////////////////////도서대출
router.post('/', expressAsyncHandler(async(req, res, next) => {
    const book = await Book.findOne({
        isbn : req.body.isbn
    })
    const user = await User.findOne({
        userId : req.body.userId,
    })

    const amountBook = book.amount


    if(user && book){
        if(amountBook===0){

            await Book.updateOne({title : book.title},{
                $set:{
                    rental:true
                }
            })

            res.json('책의 재고가 부족합니다.')
        }else{
            const history = new History({
                userId : user._id,
                bookId : book._id,
                title : book.title,
                isbn : book.isbn,
                category : book.category
            })
            const newHistory = await history.save()
    
            await Book.updateOne({title : book.title},{
                $set:{
                    amount : amountBook - 1
                }
            })
    
            if(!newHistory){
                res.status(401).json({
                    code:401,
                    message:'invalid book, user data'
                })
            }else{
                const {userId, bookId, rentalTime, returnTime, title,isbn} = newHistory
                console.log('isbn :', isbn)
                res.json({
                    code:200,
                    userId, bookId, rentalTime, returnTime, title, isbn
                })
            }
        }
       
    }else{
        res.status(401).json({
            code:401,
            message:'invalid book, user data'
        })
    }
}))

////////////////////////////////////////////도서반납


router.post('/return/', expressAsyncHandler(async(req,res,next)=>{

    console.log(req.body._id, typeof req.body._id)

    const user = await User.findOne({
        userId : req.body.userId        
    })


    const history = await History.findOne({
        userId : user._id,
        isbn : req.body.isbn,
        _id : new ObjectId(req.body._id)
    })

    console.log(history)

    const book = await Book.findOne({
        isbn : req.body.isbn
    })

    const amountBook = book.amount



    if(user && history){
        if(history.state === '미납' || history.state === '연체'){
            const returnDate = new Date()
            await History.updateOne({
                userId : user._id,
                isbn : req.body.isbn,
                _id : new ObjectId(req.body._id)
            },{
                $set:{state:'반납', finishedTime:returnDate, returnTime:null}
            })       
    
    
    
            await Book.updateOne({_id : req.params.book},{
                $set:{
                    amount:amountBook + 1
                }
            })
    
            if(book.amount != 0){
                await Book.updateOne({isbn : req.body.isbn},{
                    $set:{
                        rental:false,
                    }
                })
            }   
        
            res.json(`${book.title} / 재고 : ${amountBook+1} / ${returnDate}  에반납완료`)
        }else{
            res.json('이미 반납 완료 하셨습니다.')
        }
        
    }else{
        res.status(401).json({
            code:401,
            message:'invalid user, book data!'
        })
    }

}))

////////////////////////////////////////////////////////////////////////////////연장, 연체

router.post('/extention', expressAsyncHandler(async(req,res,next) => {

    console.log(new ObjectId(req.body._id))

    const user = await User.findOne({
        userId : req.body.userId
    })
    const history = await History.findOne({
        userId : user._id,
        isbn : req.body.isbn,
        _id : new ObjectId(req.body._id)
    
    })
    // console.log(history)
    if(user && history){

        if(history.state === '미납' || history.state === '연체'){
            // console.log(history.returnTime)
            const returnTimer = history.returnTime.getTime()
            await History.updateOne({
                isbn : req.body.isbn,
                _id : new ObjectId(req.body._id)
            },{
                $set:{returnTime: new Date(returnTimer + 86400000)}
            })
            const updatedHistory = await History.findOne({
                isbn : req.body.isbn    ,
                _id : new ObjectId(req.body._id)    
            })
            res.json({
                code:200,
                message: `${updatedHistory.returnTime}  까지 연체 하셨습니다.`
            })
        }else{
            res.json('이미 반납 완료 하셨습니다.')
        }
        
    }else{
        res.status(401).json({
            code:401,
            message:'invalid user, book data'
        })
    }
}))


//////////////////////////////////////////////////////////////////////////////대출 도서 목록 조회/////연체내역 체크
router.post('/join', expressAsyncHandler(async(req,res,next) => {

    const user = await User.findOne({
        userId : req.body.userId
    })


    const history = await History.find({
        userId : user._id
    })

    if(history && user){
        
        const time = Date.now()

        for(ele of history){

            if(ele.returnTime !== null){
                
                if(ele.returnTime.getTime() < time){

                    await History.updateOne({
                        _id : ele._id 
                    },{
                        $set:{state:'연체'}
                    })
                }else{
                    await History.updateOne({
                        _id : ele._id 
                    },{
                        $set:{state:'미납'}
                    })
                }
            }
           
        }
    const updatedHistory = await History.find({
            userId : user._id
    })
        res.json(updatedHistory)


    }else{
        res.status(401).json({
            code:401,
            message:'invalid user data'
        })
    }
}))
////////////////////////////////////////////////////////////////대출 목록 카테고리별 분류 조회
router.post('/join/category', expressAsyncHandler(async(req,res,next)=>{
    const user = await User.findOne({
        userId : req.body.userId
    })
    const history = await History.find({
        userId : user._id,
        category : req.body.category
    })

    if(user && history){
        console.log(history)
        res.json(history)
    }else{
        res.status(404).json({
            code:404,
            message:'invalid value'
        })
    }
}))



////////////////////////////////////////////////////////////////////대출 도서 상세 조회
router.post('/join/:book', expressAsyncHandler(async(req,res,next) => {
    const user = await User.findOne({
        userId : req.body.userId,
     })
    const history = await History.findOne({
        isbn : req.body.isbn,
        title : req.body.title
    }).populate('bookId')

    console.log(history)

    if(history && user){
       
        const {title, summary, author,category} = history.bookId
        res.json({
            code:200,
            title, summary, author, category
        })
    }else{
        res.status(401).json({
            code:401,
            message:'invalid user data'
        })
    }

}))



module.exports = router