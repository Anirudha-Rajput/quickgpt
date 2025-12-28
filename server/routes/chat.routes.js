const express = require("express");
const { createChatController, deleteChatController, getChatController } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/userAuthMiddleware");
const router = express.Router();

router.get("/create",authMiddleware, createChatController)
router.get("/get",authMiddleware, getChatController)
router.delete("/delete/:chatId",authMiddleware, deleteChatController)


module.exports = router;