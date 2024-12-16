import mongoose from "mongoose";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
      },
      email: {
        type: String,
        required: true,
        isLowercase:true,
        unique:true,
        validate: [ validator.isEmail, 'invalid email' ]
      }
})

usersSchema.index({ username: 1 });
usersSchema.index({ email: 1 });


export default mongoose.model("User", usersSchema);