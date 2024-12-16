import express from "express";
import User from "../models/users.mjs";



const router = express.Router();
//get all the users
//http://localhost:5050/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});



// Create a single user 
//http://localhost:5050/users
router.post("/", async (req, res) => {
    let newDocument = req.body;

    try{
      const user = new User(newDocument)
      await user.save();
      res.status(201).send(user);
  
    }catch (error){
      res.status(400).send(error.message)
    }
  
  });
  
  
  
  // Get a single user 
  //http://localhost:5050/users/:id
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if(!user){
        res.status(404).send("Not found")
      }else{
        res.status(200).send(user)
      }
    }catch (error){
      res.status(400).send(error)
    };
   
   });
//Delete a single user
//http://localhost:5050/users/:id

  router.delete("/:id", async (req, res) => {
    try{
      const result = await User.findByIdAndDelete(
        req.params.id
      )  ;
      if(!result){
        res.status(404).send("Not found")
      }else{
        res.status(200).send(result)
      }
    }catch (error){
      res.status(400).send(error)
    };
  
  });
export default router;