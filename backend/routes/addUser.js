const express = require("express");
const router = express.Router();
const queue = require("../queues/queue");

router.post("/addUser", queue);

module.exports = router;
