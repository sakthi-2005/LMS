const express = require("express");
const router = express.Router();
const queue = require("../utils/queue");

router.post("/addUser", queue);

module.exports = router;
