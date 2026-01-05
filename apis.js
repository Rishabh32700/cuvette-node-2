const express = require("express");
const cors = require("cors");
const fs = require("fs");

const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/abcxyz").then(()=>{
  console.log("connected to DB !!!");  
}).catch((err)=>{
  console.error(err)
})

const studentSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  age: Number,
  course :{
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

const users = require("./MOCK_DATA.json");
const { type } = require("os");

const app = express();
app.use(cors());

// middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((req, res, next)=>{
    console.log("middleware 1 called");
    req.rishabh = "sharma"
    next()
})

app
  .route("/users")
  .get((req, res) => {
    console.log("hello from kid 2", req.rishabh)
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

// app.get("/users", (req, res) => {
//   res.json(users);
// });

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
