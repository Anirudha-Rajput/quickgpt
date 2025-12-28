const JWT = require("jsonwebtoken");
const userModel = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
    try {
        let   token = req.cookies.token;
    console.log(token)
        if (!token) return res.status(404).json({
            message: "token not found"
        })
        let decode = JWT.verify(token, process.env.JWT_SECRET)
        let user = await userModel.findById(decode.id).select("-password");
        if (!user) return res.status(409).json({
            message: "invalid token"
        })
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
        message: "Authentication failed",
        error: error
        })

    }
}
module.exports = authMiddleware;