const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true
       
      },
      userId: {
        type: String,
        required: true,
        unique: true // unique: 색인(primary key) email은 중복불가
      },
      password: {
        type: String,
        required: true,
      },
      books: [{
        type:Object
      }
      ],
      isAdmin: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      lastModifiedAt: {
        type: Date,
        default: Date.now(),
      }


})

/////////////////////////////////////////////////////////////////// user 데이터 검증
userSchema.path('email').validate(function(value){
  return /^[a-zA-Z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,3})$/.test(value)
}, 'email `{VALUE}` 는 잘못된 이메일 형식입니다.')

// 숫자, 특수문자 최소 1개 포함하기 (7~15자)
userSchema.path('password').validate(function(value){
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*\.]{7,15}$/.test(value)
}, 'password `{VALUE}` 는 잘못된 비밀번호 형식입니다.')
/////////////////////////////사용자 아이디 검증
userSchema.path('userId').validate(function(value){
  return/[a-zA-Z1-9]{7,12}/.test(value)
},'userId `{VALUE}`는 잘못된 아이디 형식입니다.')




const User = mongoose.model('User', userSchema)
module.exports = User