const express=require("express");
const { registerController, loginController, getUserController, getPublishedImages } = require("../controllers/authController");
const authMiddleware = require("../middlewares/userAuthMiddleware");
const router=express.Router()

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/profile",authMiddleware,getUserController)
router.get("/published-images",authMiddleware,getPublishedImages)

module.exports=router;