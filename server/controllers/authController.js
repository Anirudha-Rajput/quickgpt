const bcrypt = require("bcrypt")
const userModel = require("../models/user.model")
const JWT = require("jsonwebtoken")
const chatModel = require("../models/chat.model")

// register api
const registerController = async (req, res) => {
    try {
        let { name, email, password } = req.body
        let existingUser = await userModel.findOne({ email })
        if (existingUser) return res.status(409).json({
            message: "user already exist...please login"
        })

        const newUser = await userModel.create({
            name, email, password
        })
        let token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

        res.json({
            success: true,
            token
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            Message: error.message,

        })
    }

}

const loginController = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) return res.status(404).json({
            message: "all field required"
        })
        let user = await userModel.findOne({ email })
        if (!user) return res.status(404).json({
            message: "no user found ... please register"
        })


        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(404).json({
            message: 'invalid password'
        })

        let token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

        return res.json(
            {
                success: true,
                message: "user logged in successfully",
                token
            })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            Message: error.message,

        })
    }
}



const getUserController = async (req, res) => {
    try {

        let user = req.user;
        return res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,

            Message: "internal server error",
            error: error
        })
    }
}

const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await chatModel.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
        ])
        return res.status(200).json({
            success: true,
            images: publishedImageMessages.reverse()
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message,

        })
    }
}
module.exports = { registerController, loginController, getUserController, getPublishedImages }