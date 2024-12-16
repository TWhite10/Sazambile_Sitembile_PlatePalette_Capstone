import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const recipesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    instructions: {
        type: String,
        required: true,
      },
      cookTime: {
        type: Number,
        required: true,
        min:0
      },

     
})

recipesSchema.index({ title: 1 });


export default mongoose.model("Recipe", recipesSchema);