const express=require("express")
const { textMesageController, imageMessageController } = require("../controllers/messageController")
const authMiddleware = require("../middlewares/userAuthMiddleware")
const router=express.Router()

router.post("/text/:chatId",authMiddleware,textMesageController)
router.post("/image/:chatId",authMiddleware,imageMessageController)

module.exports=router