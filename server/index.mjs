import express from "express";
import mongoose from "mongoose";

import { userData, recipeData, commentData } from "./src/utilities/data.mjs";

import users from "./src/routes/users.mjs";
import comments from "./src/routes/comments.mjs";
import recipes from "./src/routes/recipes.mjs";
import {createError} from "./src/utilities/error.mjs";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5050;

mongoose.connect(process.env.ATLAS_URI);

const app = express();
//Middleware
app.use(express.json());


app.use("/users", users);
app.use("/comments", comments);
app.use("/recipes", recipes);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(err.status || 500).json({ 
    error: { 
      message: err.message, 
      status: err.status 
    }})
});
app.use((req, res) => {
  res.status(404).json({ error: { message: "Not Found", status: 404 }});
});


//seed data 
app.get("/seed", async (req, res) => {
  try {
    await User.insertMany(userData);
    await Recipe.insertMany(recipeData);
    await Comment.insertMany(commentData);
    res.send("Successful database seeding")
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
