import express from "express";
import pg from "pg";

const app = express();

const { Client } = pg;

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: "5432",
  database: "api",
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

const port = 3000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
