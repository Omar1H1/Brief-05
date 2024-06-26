## Client side :

1- Create a signup.html page

```html
<!DOCTYPE html>

<html lang="en">
  <head>
       
    <meta charset="UTF-8" />

       
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

       
    <title>Sign Up</title>

       
    <script defer src="./js/signup.js"></script>
  </head>

  <body>
       
    <h2>Sign Up</h2>

       
    <form action="#" method="post">
              <label for="first_name">First Name:</label><br />

             
      <input
        type="text"
        id="first_name"
        name="first_name"
        required
      /><br /><br />

              <label for="last_name">Last Name:</label><br />

             
      <input type="text" id="last_name" name="last_name" required /><br /><br />

              <label for="email">Email:</label><br />

             
      <input type="email" id="email" name="email" required /><br /><br />

              <label for="password">Password:</label><br />

             
      <input
        type="password"
        id="password"
        name="password"
        required
      /><br /><br />

              <input type="submit" value="Sign Up" />

         
    </form>
  </body>
</html>
```

2- need to link this static page to a signup.js

```js
window.addEventListener("load", async () => {
  const formEl = document.querySelector("form");

  formEl.addEventListener("submit", async (event) => {
    const formData = new FormData(formEl);

    const { first_name, last_name, email, password } =
      Object.fromEntries(formData);

    try {
      const response = await fetch("/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },

        body: JSON.stringify({
          first_name: first_name,

          last_name: last_name,

          email: email,

          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  });
});
```

let us break this down :

- i need to listen for the signup form but first i need to select it

```js
const formEl = document.querySelector("form");
```

- after that we will wait for when this form will be submit, this is why the event is async

```js
formEl.addeventlistener("submit", async (event) => {});
```

- now let's handle the logic of what it should/will happen when the submit is finally done

```js
const formData = new FormData(formEl);
```

the code above just means that the object formData will now contain a new instance of all the fields of the form html element .

- now let's use object destructing to extract every field of our form

```js
const { first_name, last_name, email, password } = Object.fromEntries(formData);
```

Now we have everything that we need to create our new user, let's fetch our data to our server

```js
try {
	const response = await fetch (/signup)
	......
} catch (error) {

}
```

## Server side :

wait a minute, you might ask yourself but we don't have a server ?? what is hell is /signup !!

well, we need to create a server then i guess :)

for this project we used express js

let's take a look at our main js, this will be our entry point of our app

```js
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
```

woow lot's of code, let's break this down one by one

#### start an express server :

- after following the doc's and creating the npm project and installing all the dependency's, we gonna start by importing express modules

```js
import express from "express";
```

express module is now available in our page, this module have objects and methods, don't worry we will find more about those as we go along

- to be able to use this module we need to store it in a variable

```js
const app = express();
```

- now that app holds the express module we will use a method on it

```js
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
```

you might ask what is the port mentioned here, let's declare it

```js
const port = 3001;
```

- now let's take an over all view of our main.js for now

```js
import express from "express";

app = express();
port = 3001;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
```

Now we have our server is up and running ....

we still don't have our /signup yet, this is a route we will create a folder called router and inside that folder we will create a file called auth.js which a part of it will look like this for now.

```js
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
```

let's break this router one by one, first we need to import express again for this file

```js
import express from "express";
```

set up a variable to hold the express module

```js
const router = express.Router();
```

now that we have a this we can use some methods

```js
router.use(express.json());
```

this method will parse incoming req with json

now let's declare this route

```js
router.post('/signup', async (req, res) => {
	.....
});
```

as this is a post route we will need handle the request coming from the user
