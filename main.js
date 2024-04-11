import express from "express";
import session from "express-session";
import auth_router from "./routers/auth.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));
app.use(auth_router);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
