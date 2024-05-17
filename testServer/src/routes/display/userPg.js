const express = require('express')
const User = require('../../models/User')
const expressAsyncHandler = require('express-async-handler')
const History = require('../../models/History')
// const {generateToken, isAuth} = require('../../../auth')
const {validationResult} = require('express-validator')
const {
    validateUserName,
    validateUserEmail,
    validateUserPassword,
    validateUserId
} = require('../../../validator')

const router = express.Router()

////////////////////////////////회원가입
router.post('/register',[
    validateUserName(), validateUserEmail(), validateUserPassword(), validateUserId()
], expressAsyncHandler(async(req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        res.status(400).json({
            code:400,
            message:'invalid form data for user',
            error : errors.array()
        })
    }else{
        try{
            const user = new User({
                name : req.body.name,
                email : req.body.email,
                userId : req.body.userId,
                password : req.body.password
            })
            const newUser = await user.save()

            const {name, email, userId, isAdmin, createdAt, books, _id} = newUser
            console.log(newUser._id)
            res.json({
                code:200,
                name, email, userId, isAdmin, createdAt, books
            })
        }
        catch(e){
            res.status(401).json({ code: 401, message: 'Invalid User Data',e})
        }
    }

}))

//////////////////////////////////////////로그인
router.post('/login', expressAsyncHandler(async (req, res, next)=>{

    const loginUser = await User.findOne({
        userId : req.body.userId,
        password : req.body.password
    })

    if(!loginUser){
        console.log(loginUser)
        res.status(401).json({code:401, message : 'Invalid UserId or Password'})
    }else{
        if(loginUser.isAdmin){                  ////////////////관리자 로그인
           
            const history = await History.find({})
            console.log(history)
            if(history){                
                const time = Date.now()
        
                for(ele of history){
                    if(ele.returnTime.getTime() < time){
                        // console.log(ele.returnTime.getTime()<time)
                        await History.updateMany({},{
                            $set:{state:'연체'}
                        })
                    }
                }
            const {name, email, userId, isAdmin, createdAt, books} = loginUser
            const updatedHistory = await History.find({})
                res.json({
                    code:200,
                    updatedHistory, name, email, userId, isAdmin, createdAt, books
                })       
            }


        }else{
            const {name, email, userId, isAdmin, createdAt, books} = loginUser
            res.json({
                code:200,
                name, email, userId, isAdmin, createdAt, books
            })
        }       
    }
}))

//////////////////////////////////// 회원정보 수정하기
//인증폼
router.post('/',expressAsyncHandler(async(req,res,next)=>{
    
    console.log(req.body.userId, req.body.password)
    const user = await User.findOne({
        userId : req.body.userId,
        password : req.body.password
    })

    console.log(user)
    if(!user){
        res.status(404).json({ code: 404, message: 'User Not Founded'})
    }else{

        const {name, email, password, userId, isAdmin, books} = user
        res.json({
            code:200,
            name, email, password, userId, isAdmin, books
        })
    }
}))

router.put('/update/',[validateUserName(),
    validateUserEmail(),
    validateUserPassword(),
    validateUserId()] ,expressAsyncHandler(async(req, res, next) => {

        console.log(req.body)
    const errors = validationResult(req)


    if(!errors.isEmpty()){
        res.status(400).json({
            code:400,
            message:'invalid form data for user',
            error : errors.array()
        })
    }else{
        const user = await User.findOne({
            userId : req.body.authId})  
            console.log(user)  
        if(!user){
            res.status(404).json({ code: 404, message: 'User Not Founded'})
        }else{

            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.password = req.body.password || user.password
            const updatedUser = await user.save()
            const {name, email, password, userId, isAdmin, books} = updatedUser
            res.json({
                code:200,
                name, email, password, userId, isAdmin, books
            })
        }
    }

    
}))

///////////////////////////////////////// 회원정보 삭제하기
router.delete('/delete', expressAsyncHandler(async(req, res, next) => {

    const user = await User.find({
        userId : req.body.userId,
        password : req.body.password})

    if(!user){

        res.status(404).json({code: 404, message : 'User Not Founded'})
    }else{
        await User.deleteOne({
            userId : req.body.userId,
            password : req.body.password
        })

        res.status(200).json({code:200, message: 'User deleted successfully'})
    }
}))


module.exports = router