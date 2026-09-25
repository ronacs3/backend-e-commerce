const express = require("express");
const router = express.Router();
const { chatWithAI } = require("./chat.controller");

// Định nghĩa phương thức POST cho đường dẫn gốc của route này
router.post("/", chatWithAI);

module.exports = router;
