import express from "express";
import pool from "../utils/pg.js";
import bcrypt from "bcrypt";
import jwtTokens from "../utils/jwt-helpers.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();

router.use(express.json());

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedSignPassword = await bcrypt.hash(password, 10);
    const save = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, email, hashedSignPassword]
    );
    res.status(201).json(save.rows[0]);
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (findUser.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const matched = await bcrypt.compare(password, findUser.rows[0].password);
    if (!matched) {
      return res.status(400).json({ error: "Invalid password" });
    }
    let tokens = jwtTokens(findUser.rows[0]);
    req.session.token = tokens; // Storing token in session
    res.json({ accessToken: tokens });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await pool.query("SELECT * FROM posts WHERE author_id = $1", [
      userId,
    ]);

    if (posts.rows.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.json({ posts: posts.rows });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
