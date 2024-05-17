const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema


const historySchema = new Schema({
    userId : {
        type : ObjectId,
        require : true,
        ref:'User'
    },
    bookId : {
        type : ObjectId,
        require : true,
        ref:'Book'
    },
    rentalTime : {
        type : Date,
        require : true,
        default : Date.now()
    },
    returnTime : {
        type : Date,
        default : new Date(Date.now() + 10)
        // 86400000
    },
    finishedTime:{
        type : Date

    },
    title:{
        type:String,
        require : true,
        ref:'Book'
    },
    state : {
        type:String,
        require: true,
        default : '미납'
    },
    isbn : {
        type : Number,
        required : true,
    },
    category : {
        type : String,
        required : true
    }
})




const history = mongoose.model('History', historySchema)
module.exports = history