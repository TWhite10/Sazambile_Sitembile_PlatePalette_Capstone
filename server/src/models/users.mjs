import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    isLowercase: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: true
  }
  //name
  //bio

})
//hash password
usersSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
//check password
usersSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

usersSchema.index({ username: 1 }, { unique: true });
usersSchema.index({ email: 1 });



export default mongoose.model("User", usersSchema);