const express = require("express");
const cors = require("cors");
const fs = require("fs");

const users = require("./MOCK_DATA.json");

const app = express();
app.use(cors());

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get("/users", (req, res) => {
//   res.json(users);
// });

app
  .route("/users")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    const body = req.body
    users.push({...body, id: users.length+1})    

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        res.json({ status: "success", users:users });
    })
  });

app
  .route("/users/:id")
  .get((req, res) => {
    const id = req.params.id;
    const user = users.find((user) => user.id == id);
    res.json(user);
  })
  .patch((req, res) => {
    const id = req.params.id;
    const user = users.find((user) => user.id == id);

    if (!user) {
      return res.json({ status: "failed to find user" });
    }

    console.log(req.headers, req.body);
    Object.assign(user, req.body);
    console.log("updated user =>", user);
    res.json({ status: "success" });
  })
  .delete((req, res) => {
    const id = req.params.id;
    const index = users.findIndex((user) => user.id == id);

    if (index === -1) {
      return res.json({ status: "failed to find user" });
    }

    const dletedUser = users.splice(index, 1)
    console.log("all users = ", users);
    
    res.json({ status: "success" });
  });

// app.get("/users/:id", (req, res) => {
//   const id = req.params.id;
//   const user = users.find((user) => user.id == id);
//   res.json(user);
// });

// app.patch("/users/:id", (req, res) => {
//   //   TODO : update the record
//   res.json({ status: "success" });
// });

// app.delete("/users/:id", (req, res) => {
//   //   TODO : delete the record
//   res.json({ status: "success" });
// });

// app.post("/users", (req, res) => {
//   //   TODO : create new record
//   res.json({ status: "success" });
// });

app.listen(8000);
