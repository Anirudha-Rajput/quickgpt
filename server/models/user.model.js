const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    }
    ,
    email: {
        required: true,
        unique: true,
        type: String
    },

    password: {
        required: true,
        type: String,
        minlength: 8
    },
    credits: {
        type: Number,
        default: 20
    }
})

userSchema.pre("save", async function () {  // Remove (next) parameter
    if (!this.isModified("password")) return;  // No next()
    this.password = await bcrypt.hash(this.password, 12);  // Increased salt
});


const userModel = mongoose.model("User", userSchema)
module.exports = userModel;


