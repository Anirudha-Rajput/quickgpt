const JWT = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        // 4️⃣ Find user
        const user = await userModel
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.json({success:false,
                message: "user not found"
            });
        }

        // 5️⃣ Attach user
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
         res.status(401).json({
            message: "Not Authorized"
        });
    }
};

module.exports = authMiddleware;
