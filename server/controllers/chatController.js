const chatModel = require("../models/chat.model");

const createChatController = async (req, res) => {
    console.log("chali")
    try {
        const userId = req.user._id
        console.log(req.user)
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }


        await chatModel.create({
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        })
        return res.status(200).json({
            message: "chat created",
            chat: chatData
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            messgae: "internal server error",
            error: error
        })
    }
}


const getChatController = async (req, res) => {
    try {

        const userId = req.user._id;
        const chats = await chatModel.find({ userId }).sort({ updateAt: -1 })
        return res.status(201).json({
            message: "chat fetched",
            chat:chats
        })

    } catch (error) {
        return res.status(500).json({
            messgae: "internal server error",
            error: error
        })
    }
}

const deleteChatController = async (req, res) => {
    try {

        const userId = req.user._id;
        const {chatId} = req.params;
        await chatModel.findByIdAndDelete({ _id: chatId, userId })
        return res.status(201).json({
            message: "chat deleted",

        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            messgae: "internal server error",
            error: error
        })
    }
}


module.exports = {
    createChatController,
    getChatController,
    deleteChatController

}