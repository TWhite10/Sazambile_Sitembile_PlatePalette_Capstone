import express from "express";
import Recipe from "../models/recipes.mjs";
import User from "../models/users.mjs";
import {requireJwtAuth} from "../middleware/auth.mjs"


const router = express.Router();
//get all the recipes
//http://localhost:5050/recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(
      {
        data: recipes,
        links: [
          {
            href: "/recipes/new",
            rel: "create",
            type: "POST"
          }
        ]
      });
  } catch (error) {
    res.status(400).json({
      error: { message: error.message }
    });
  }
});

//get single recipes
//http://localhost:5050/recipes/:id
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        error: {
          message: "Recipe not found :("
        }
      });
    }
    res.status(200).json(
      { data: recipe });
  } catch (error) {
    res.status(400).json({
      error: { message: error.message }
    });
  }
});


// Create a single recipe with validation
//http://localhost:5050/recipes
router.post("/",requireJwtAuth, async (req, res) => {
  const { title, instructions, cookTime, user } = req.body;

  if (!title || !instructions || !cookTime || !user) {
    return res.status(404).json({
      error: {
        message: "Please add all reqiured fields (title,instructions,cooking time and user)"
      }
    });
  }
  if (cookTime <= 0) {
    return res.status(400).json({
      error: {
        message: "Cooking time must be greater than 0"
      }
    });
  }

  try {
    // check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        error: {
          message: "User not found"
        }
      });
    }

    const recipe = new Recipe({
      title,
      instructions,
      cookTime,
      user
    });
    await recipe.save();
    res.status(201).json({ data: recipe });
  } catch (error) {
    res.status(400).json({
      error: { message: error.message }
    })
  }

});

// Updating recipe
//http://localhost:5050/recipes/:id
router.patch("/:id",requireJwtAuth, async (req, res) => {

  const { title, instructions, cookTime } = req.body;

  if (cookTime !== undefined && cookTime <= 0) {
    return res.status(400).json({
      error: {
        message: "Cooking time must be greater than 0"
      }
    });
  }

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({
        error: {
          message: "Recipe not found :("
        }
      })
    }
    res.status(200).json({ data: recipe })

  } catch (error) {
    res.status(400).json({
      error: { message: error.message }
    })
  };

});

//Delete a single recipe
//http://localhost:5050/recipes/:id
router.delete("/:id", requireJwtAuth, async (req, res) => {
  try {
    const result = await Recipe.findByIdAndDelete(
      req.params.id
    );
    if (!result) {
      return res.status(404).json({
        error: {
          message: "Recipe not found :("
        }
      })
    }
    res.status(200).json({
      message: "Recipe successfully deleted",
      data: result
    })

  } catch (error) {
    res.status(400).json({
      error: { message: error.message }
    })
  };

});


export default router;