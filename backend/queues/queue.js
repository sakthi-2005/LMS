const { Queue } = require("bullmq");
require("dotenv").config();

const userQueue = new Queue("addUser", {
  connection: { port: process.env.REDIS_PORT || 6379 , host: process.env.REDIS_HOST || "127.0.0.1" , password: process.env.REDIS_PASSWORD, maxRetriesPerRequest: null },
});

const CHUNK_SIZE = 10;

module.exports = async function queue(req, res) {
  const data = req.body.params.data;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Expected a JSON array" });
  }

  const totalChunks = Math.ceil(data.length / CHUNK_SIZE);

  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const users = data.slice(i, i + CHUNK_SIZE);
    await userQueue.add("users", { users });
  }

  res.json({ message: `${totalChunks} jobs queued.` });
};
