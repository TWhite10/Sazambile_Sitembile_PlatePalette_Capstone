import express from "express";
import Recipe from "../models/recipes.mjs";



const router = express.Router();
//get all the recipes
//http://localhost:5050/recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(
      {data:recipes});
  } catch (error) {
    res.status(400).json( {message: error.message,
      error: error});
  }
});

//get single recipes
//http://localhost:5050/recipes
router.get("/:id", async (req, res) => {
  try {
    const recipes = await Recipe.findById(req,params.id);
    if(!recipe){
      return res.status(404).json({
        error:{
          message:"Recipe not found :("
        }
      });
    }
    res.status(200).json(
      {data:recipes});
  } catch (error) {
    res.status(400).json( {message: error.message,
      error: error});
  }
});

// Create a single recipe with validation
//http://localhost:5050/recipes
router.post("/", async (req, res) => {
    const {title,instructions,cookTime} = req.body;
    if(!title|| !instructions || !cookTime){
      return res.status(404).json({
        error:{
          message:"Please add a title,instructions and cooking time"
        }
      });
    }

    try{
      const recipe = new Recipe({title,instructions,cookTime})
      await recipe.save();
      res.status(201).json({data:recipe});
  
    }catch (error){
      res.status(400).json( {message: error.message,
        error: error})
    }
  
  });

    // Updating recipe
    //http://localhost:5050/recipes/:id
  router.patch("/:id", async (req, res) => {
    try{
      const recipe = await Recipe.findByIdAndUpdate(
        req.params.id, 
        {$set: req.body },
        {new:true}
      )  ;
      if(!recipe){
        res.status(404).json({
          error:{
            message:"Recipe not found :("
          }
        })
      }
        res.status(200).json({data:recipe})
      
    }catch (error){
      res.status(400).json({message: error.message,
        error: error})
    };
  
  });

  //Delete a single recipe
  //http://localhost:5050/recipes/:id
  router.delete("/:id", async (req, res) => {
    try{
      const result = await Recipe.findByIdAndDelete(
        req.params.id
      )  ;
      if(!result){
        return res.status(404).send({error:{
          message:"Recipe not found :("
        }})
      }
        res.status(200).json({message:"Recipe successfully deleted",
          data: recipe})
      
    }catch (error){
      res.status(400).json({message: error.message,
        error: error})
    };
  
  });
  
  
export default router;