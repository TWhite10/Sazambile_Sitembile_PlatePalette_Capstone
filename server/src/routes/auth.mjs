import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.mjs";
import authController from "../controllers/authController.mjs"
const router = express.Router();


// router.route("/")
//     .post(authController.login)

// router.route("/refresh")
//     get(authController.refresh)

// router.route("/logout")
//     .post(authController.logout)


export default router;