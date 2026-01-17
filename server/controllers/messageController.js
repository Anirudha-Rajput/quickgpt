const chatModel = require("../models/chat.model")
const axios = require("axios")
const imagekit = require("../services/storage.services")
const openai = require('../src/config/openai')
const userModel = require("../models/user.model")

// text generation message controller
const textMesageController = async (req, res) => {
    console.log("🔥 TEXT CONTROLLER HIT");
    try {
        const userId = req.user._id
        // check credits
        if (req.user.credits < 1) {
            return res.status(403).json({
                message: "You don't have enough credits to use this feature"
            })
        }
        const { chatId } = req.params
        const { prompt } = req.body
        const chat = await chatModel.findOne({userId, _id: chatId },)
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" })
        }
        chat.messages.push({ role: "user", content: prompt, isImage: false, timestamp: Date.now() })
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const reply = { ...choices[0].message, isImage: false, timestamp: Date.now() }
        res.json({ success: true, reply })
        chat.messages.push(reply);
        await chat.save();
        await userModel.updateOne({ _id: userId }, { $inc: { credits: -1 } })
    } catch (error) {
         res.json({
            success:false,
            message: error.message
        })
    }
}


// image generation message controller

const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        // check credits
        if (req.user.credits < 2) {
            return res.status(403).json({
                message: "You don't have enough credits to use this feature"
            })
        }

        const { prompt, isPublished, } = req.body;
        const { chatId } = req.params

        const chat = await chatModel.findOne({ _id: chatId, userId })
        // find chat
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" })
        }
        chat.messages.push({
            role: "user",
            content: prompt,
            isImage: false,
            timestamp: Date.now()
        })

        // encoded prompt

        const encodedPrompt = encodeURIComponent(prompt)

        // construct imagekit ai generation URl
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`

        // Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })

        // Convert to Base64
        const base64image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`

        //    Upload to ImageKit Media Library

        const uploadResponse = await imagekit.upload({
            file: base64image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        })

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }
        res.json({ success: true, reply })
        chat.messages.push(reply)
        await chat.save()
        await userModel.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    }


    catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error
        })
    }
}


module.exports = { imageMessageController, textMesageController }