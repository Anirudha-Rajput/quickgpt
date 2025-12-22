const express = require("express");
const { getPlansController, purchasePlanController } = require("../controllers/credits.controller");
const authMiddleware = require("../middlewares/userAuthMiddleware");
const router = express.Router();

router.get("/plans", getPlansController)
router.post("/purchase/:planId", authMiddleware, purchasePlanController)

module.exports = router;
