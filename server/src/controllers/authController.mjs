import express from "express";
import User from "../models/users.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateJwtTokens = (userId) => {
    const accessToken = jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
  
    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
  
    return { accessToken, refreshToken };
  };
 
// Register new user
//http://localhost:5050/auth/register
export const register = async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({
        error: {
          message: "Please add all required fields (username, email, password)"
        }
      });
    }
  
    try {
      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
  
      if (existingUser) {
        return res.status(400).json({
          error: {
            message: "Username or email already exists :("
          }
        });
      }
  
      const user = new User({
        username,
        email,
        password
      });
      await user.save();
  
      res.status(201).json({
        data: {
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(400).json({
        error: { message: error.message }
      });
    }
  };
  

// Login user
//http://localhost:5050/auth/login
export const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: "Please add all required fields (email, password)"
        }
      });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          error: {
            message: "Invalid email or password :("
          }
        });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          error: {
            message: "Invalid email or password :("
          }
        });
      }
  
      const tokens = generateJwtTokens(user._id);
  
      res.status(200).json({
        data: {
          user: {
            username: user.username,
            email: user.email
          },
          tokens
        }
      });
    } catch (error) {
      res.status(400).json({
        error: { message: error.message }
      });
    }
  };
  

// Refresh token
//http://localhost:5050/auth/refresh
export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({
        error: {
          message: "Refresh token is required"
        }
      });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
  
      res.status(200).json({
        data: { accessToken }
      });
    } catch (error) {
      res.status(401).json({
        error: {
          message: "Invalid refresh token :("
        }
      });
    }
  };
  
// Logout user
//http://localhost:5050/auth/logout
export const logout = async (req, res) => {
    res.status(200).json({
      data: {
        message: "Successfully logged out :)"
      }
    });
  };

export default router;