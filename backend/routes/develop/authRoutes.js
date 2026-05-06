const express = require("express");
const { getMe, login, signup } = require("../../controllers/develop/authController");
const { protect } = require("../../middleware/develop/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
