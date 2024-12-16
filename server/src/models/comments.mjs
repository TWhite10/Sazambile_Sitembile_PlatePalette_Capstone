import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const commentsSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    } ,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipe:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Recipe",
        required:true
    },
   date:{
    type:Date,
    default:Date.now
   }
   
    
    
})

commentsSchema.index({ user:1, text: 1,recipe:1 });

export default mongoose.model("Comments", commentsSchema);