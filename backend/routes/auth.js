const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { UserRepo } = require("../config/db");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const rows = await UserRepo.findOneBy({ email });

    const match = await bcrypt.compare(password, rows.password);

    if (!rows || match === false) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      res.json({
        user: { id: rows.id, email: rows.email, isAdmin: rows.isAdmin },
        token: generateToken(rows),
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

function generateToken(user) {
  const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
}

module.exports = router;
