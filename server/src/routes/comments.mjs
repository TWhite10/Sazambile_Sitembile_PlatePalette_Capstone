import express from "express";
import Comment from "../models/comments.mjs";



const router = express.Router();
//get all the comments
//http://localhost:5050/comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a single  comment
//http://localhost:5050/comments
router.post("/", async (req, res) => {
    let newDocument = req.body;

    try{
      const  comment = new Comment(newDocument)
      await  comment.save();
      res.status(201).send( comment);
  
    }catch (error){
      res.status(400).send(error.message)
    }
  
  });

    // Updating  comment
    //http://localhost:5050/comments/:id
  router.patch("/:id", async (req, res) => {
    try{
      const  comment = await Comment.findByIdAndUpdate(
        req.params.id, 
        {$set: req.body },
        {new:true}
      )  ;
      if(!comment){
        res.status(404).send("Not found")
      }else{
        res.status(200).send(comment)
      }
    }catch (error){
      res.status(400).send(error)
    };
  
  });

  //Delete a single  comment
  //http://localhost:5050/comments/:id
  router.delete("/:id", async (req, res) => {
    try{
      const  comment = await Comment.findByIdAndDelete(
        req.params.id
      )  ;
      if(! comment){
        res.status(404).send("Not found")
      }else{
        res.status(200).send( comment)
      }
    }catch (error){
      res.status(400).send(error)
    };
  
  });
  
export default router;