const express = require("express");
const cors = require("cors");

const users = require("./MOCK_DATA.json")
const app = express();
app.use(cors())

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id
  const user = users.find((user)=>user.id == id)
  res.json(user);
  // res.end("hellooo")
});



app.listen(8000);

// GET => when we ahve to get any data from BE to FE
// POST => When we have to send ant data from FE to BE
// DELETE => When we have to DELETE any data from DB
// PATCH => When we have to update already created record
// PUT => when we have to upload any file or video or image

// GET /users - get the list of users 
// DELETE /users/:id - delete user with that id
// PATCH /users/:id - modify some properties for the user with this id
// POST /users - create new user
