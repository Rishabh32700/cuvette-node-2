const express = require("express");
const cors = require("cors");
// const data = require("./MOCK_DATA.json")

const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/abcxyz").then(()=>{
  console.log("connected to DB !!!");  
}).catch((err)=>{
  console.error(err)
})

const studentSchema = new mongoose.Schema({
  first_name:{
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  gender: String,
  isActive: {
    type: Boolean,
    default: true
  }
})

const Student = new mongoose.model("Student", studentSchema)

// async function insertBulkDataForTheFirstTime(){
//   await Student.insertMany(data)
//   console.log("Data inserted Successfully!!")
// }

// insertBulkDataForTheFirstTime()

// const users = require("./MOCK_DATA.json");

const app = express();
app.use(cors());

// middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// app.use((req, res, next)=>{
//     console.log("middleware 1 called");
//     req.rishabh = "sharma"
//     next()
// })

app
  .route("/users")
  .get(async (req, res) => {
    const users = await Student.find()
    
    
    res.json(users.filter((ele)=>{
      return ele.isActive === true
    }));
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
  .get(async (req, res) => {
    const id = req.params.id;

    console.log("USER BY ID => ", req.params.id);
    const user = await Student.findById(id);
    
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
  .delete(async (req, res) => {
    const id = req.params.id;
   console.log("del id => ", id);
   
    const user = await Student.findByIdAndUpdate(
      id,
      {isActive : false},
      {new: true}
    )

    if(!user){
      console.log("failed to find user !!!!");
      
      return res.status(404).json({
        message:"failed to find user !!!!"
      })
    }


    
    res.status(200).json({ status: "success" });
    console.log("Success deleted");
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
