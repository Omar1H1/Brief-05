import express from "express";
import sql from "../utils/pg.js";
import bcrypt from "bcrypt";
import jwtTokens from "../utils/jwt-helpers.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();

router.use(express.json());

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await sql`SELECT * FROM Users`;
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const save =
      await sql`INSERT INTO users (first_name, last_name, email, password) VALUES(${first_name}, ${last_name}, ${email}, ${hashedPassword}) RETURNING id`;
    res
      .status(201)
      .json({ id: save[0].id, message: "User created successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (findUser.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const matched = await bcrypt.compare(password, findUser[0].password);
    if (!matched) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const tokens = jwtTokens(findUser[0]);
    res.json({ accessToken: tokens });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await sql`SELECT * FROM posts WHERE author_id = ${userId}`;
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.json({ posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
