import express from "express";
import Comment from "../models/comments.mjs";



const router = express.Router();
//get all the comments
//http://localhost:5050/comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.status(200).json({
      data: comments,
      links: [
        {
          href: "/comments/new",
          rel: "create",
          type: "POST"
        }
      ]
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});


// Create a single comment
// http://localhost:5050/comments
router.post("/", async (req, res) => {
  const { text, user, recipe } = req.body;
  if (!text || !user || !recipe) {
    return res.status(400).json({
      error: {
        message: "Please add all required fields (text, user, recipe)"
      }
    });
  }

  try {
    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        error: {
          message: "User not found"
        }
      });
    }

    // Check if recipe exists
    const recipeExists = await Recipe.findById(recipe);
    if (!recipeExists) {
      return res.status(404).json({
        error: {
          message: "Recipe not found"
        }
      });
    }

    const comment = new Comment({
      text,
      user,
      recipe
    });
    await comment.save();
    res.status(201).json({
      data: comment
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});


//get a single comment
//http://localhost:5050/comments/:id
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        error: {
          message: "Comment not found :("
        }
      });
    }
    res.status(200).json({
      data: comment
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

// Updating  comment
//http://localhost:5050/comments/:id
router.patch("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({
        error: {
          message: "Comment not found :("
        }
      });
    }
    res.status(200).json({
      data: comment
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

//Delete a single  comment
//http://localhost:5050/comments/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await Comment.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        error: {
          message: "Comment not found :("
        }
      });
    }
    res.status(200).json({
      message: "Comment successfully deleted",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});


export default router;