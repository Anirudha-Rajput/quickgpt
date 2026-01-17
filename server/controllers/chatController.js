const chatModel = require("../models/chat.model");

const createChatController = async (req, res) => {

    try {
        const userId = req.user._id
        console.log(req.user)
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }


        await chatModel.create(chatData)
        res.json({
            success: true,
            message: "chat created",
            chat: chatData
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            messgae: error.message,
        })
    }
}


const getChatController = async (req, res) => {
    try {

        const userId = req.user._id;
        const chats = await chatModel.find({ userId }).sort({ updateAt: -1 })
        res.json({
            success: true,
            chats
        })

    } catch (error) {
        return res.json({
            success: false,
            messgae: error.message

        })
    }
}

const deleteChatController = async (req, res) => {
    try {
       const userId = req.user._id;
        const { chatId } = req.params;
        await chatModel.findByIdAndDelete({ _id: chatId, userId })
        res.json({
            success: true,
            message: "chat deleted",
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            messgae: error.message,
        })
    }
}


module.exports = {
    createChatController,
    getChatController,
    deleteChatController

}