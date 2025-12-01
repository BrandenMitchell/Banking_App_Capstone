const express = require("express");
const router = express.Router();
const { chatWithLLM } = require("../controllers/chatController");

router.post("/", chatWithLLM);

module.exports = router;

