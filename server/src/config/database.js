const mongoose= require("mongoose")

const connectDb = async() =>{
    try {
        let res=await  mongoose.connect(process.env.MONGO_URI)
        if(res) return console.log("connected to Database")
    } catch (error) {
        console.log("Error in connecting DB ->",error)
    }
}
module.exports=connectDb;