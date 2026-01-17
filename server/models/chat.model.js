const mongoose = require("mongoose")
const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "user",
        required: true,
    },
    userName: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,
    },
    messages:[
        {
            isImage: { type: Boolean, required: true },
            isPublished: { type: Boolean, dafault: false },
            role: { type: String, required: true },
            content: { type: String, required: true },
            timestamp: { type: Number, required: true },
        }
    ]
},
{timestamps:true})

const chatModel=mongoose.model("chat",chatSchema)
module.exports=chatModel