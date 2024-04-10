import express from "express";
import client from "./utils/pg.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))

async function fetchData() {
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users WHERE id = $1", [1]);
    console.log(result.rows);
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
  }
}

fetchData();


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
