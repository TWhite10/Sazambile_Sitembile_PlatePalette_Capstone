import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.mjs";
import {register,login,refresh,logout} from "../controllers/authController.mjs"
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;