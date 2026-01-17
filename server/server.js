require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors")
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 4500
const connectDb = require("./src/config/database");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes")
const messageRoutes = require("./routes/message.routes");
const creditRoutes = require("./routes/credits.routes");
const stripeWebHooks = require("./controllers/webHooks");

connectDb();    // database connect
app.post("/api/stripe", express.raw({ type:"application/json" }), stripeWebHooks)
app.use(cors());

// app.use(cookieParser())
app.use(express.json())
//middlewares

app.use("/api/user/auth", authRoutes)
app.use("/api/chat/", chatRoutes)
app.use("/api/message/", messageRoutes)
app.use("/api/credits/", creditRoutes)
app.get("/", (req, res) => {
  res.send("server is running")
})
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`) })  // server start
