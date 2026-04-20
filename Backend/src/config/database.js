const mongoose = require('mongoose')

const connectToDb = async(req,res)=>{
    try{
    await mongoose.connect(process.env.MONGO_URI)
     console.log("connect to Database")
    }catch(err){
        console.log("DB connection error", err.message)
    }
}

module.exports = connectToDb