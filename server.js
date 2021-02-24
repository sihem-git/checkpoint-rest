const express = require('express')
const mongoose = require('mongoose')
const user = require('./models/user')
const User = require('./models/user')
const router = new express.Router()
const app = express()
app.use(express.json())
app.use('/api', router)

// ***** CONFIG .ENV *****
require("dotenv").config()
const MONGODB_URL = `mongodb://${process.env.DB_HOST}:
${process.env.DB_PORT}/${process.env.DB_NAME}`
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(
  res => console.log(` Mongodb Connected .....`),
  err => console.error(`Something went wrong: ${err}`),
);
// ****  CONFIG LISTNER ****
const port = process.env.APP_PORT
console.log("le port est:",port)
app.listen(port, () =>{
    console.log("server is up in port " + port)
})
// **** ADD A NEW USER TO THE DATABASE : "POST" ****
router.post('/users', async(req, res)=>{
  console.log("----- in POST user:",req.body)
  const user = new User(req.body)
  console.log("user posted is",user)
try {
  await user.save()
  res.status(201).send({user})
}
  catch (err){
    console.log("error is:", err)
  }
})
//***** RETURN ALL USERS : "GET" *****
router.get('/users',async(req,res)=> {
  console.log('In find all users')
  try{
    const users = await User.find()
    console.log('List of users:',users)
    res.status(201).json({
      users: users,
      message:"users found successfully"
    })
  }
  catch(err){
    res.status(404)
  }
})
//***** EDIT A USER BY ID : "PUT" *****
router.put('/users/:id',async(req,res)=>{
  try{
    const userF = await User.findById({_id: req.params.id})
    console.log("user found is:",userF)
    if (!userF){
      res.status(404).json({
        message:"This user not exit try again...",
        data:{}
      })
    }
    await User.findOneAndUpdate({_id: req.params.id},req.body)
         res.status(200).json({
         message:"User updated successfully",
         data: {}
      })
    
  }
  catch(err){
    res.status(500).send
  }
})
//*****  REMOVE A USER BY ID *****
router.delete('/users/:id', async (req, res) => {
  try {
      const userFound = await User.findOne({_id: req.params.id})
      console.log("userFound: ",userFound )
      if(!userFound){
          res.status(404).json({
              message: "Object with these information doesn't exist",
              data: {}
          })
      }
      await userFound.remove()
      res.status(200).json({
          message: "Deleted successfully",
          data: {}
      })
  } catch (e) {
      res.status(500).send()
  }
})