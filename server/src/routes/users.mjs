import express from "express";
import User from "../models/users.mjs";

const router = express.Router();

//get all the users
//http://localhost:5050/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(
      {
        data: users,
        links: [
          {
            href: "/users/new",
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

//Get a single user 
//http://localhost:5050/users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: {
          message: "User not found :("
        }
      });
    }
    res.status(200).json({
      data: user
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});
// Create a single user 
//http://localhost:5050/users
router.post("/", async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({
      error: {
        message: "Please add all required fields (username, email)"
      }
    });
  }

  try {
    const user = new User({
      username,
      email
    });
    await user.save();
    res.status(201).json({
      data: user
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});
  
//update user
//http://localhost:5050/users/:id
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        error: {
          message: "User not found :("
        }
      });
    }
    res.status(200).json({
      data: user
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});


//Delete a single user
//http://localhost:5050/users/:id

router.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        error: {
          message: "User not found :("
        }
      });
    }
    res.status(200).json({
      message: "User successfully deleted",
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