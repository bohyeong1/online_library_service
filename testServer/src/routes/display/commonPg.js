const express = require('express')
const Book = require('../../models/Book')
const expressAsyncHandler = require('express-async-handler')


const router = express.Router()

///////////////////////////전체 도서목록 조회
router.get('/', expressAsyncHandler(async(req,res,next)=>{
    try{
        const book = await Book.find({})
        res.json(book)
    }catch(e){
        res.status(401).json({ code: 401, message: 'Invalid User Data',e})
    }

}))

///////////////////////////////특정 도서목록 조회
router.post('/:isbn', expressAsyncHandler(async(req,res,next)=>{
    const book = await Book.findOne({isbn : Number(req.params.isbn) })
    if(!book){
        res.status(404).json({
            code: 404, 
            message : 'Book Not Founded'
        })
    }else{
        res.json(book)
    }
}))

module.exports = router