import express from "express"
import User from "../models/UserModel.js"
import generateToken from "../utils/generateToken.js"
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

const router = express.Router()



router.post('/signup',async (req,res) => {

  
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
  
    if (userExists) {
      res.status(400).send("user already exist!")
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashPassword
    })
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        wishlist: user.wishlist
      })
    } else {
      res.status(401).json('Invalid user data')
      
    }
  })
  
  router.post('/login', async (req,res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );
  
    if (user && isPasswordValid) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        wishlist: user.wishlist
      })
    } else {
      res.status(401).json("Invalid Username or Password")
      
    }
  })


  router.post('/changePassword',async (req,res) => {


    
          
    const user = await User.findOne({email: req.body.email })
    
    const isPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );


    if (user && isPasswordValid){

      const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
        const doc = await User.findOneAndUpdate({email: req.body.email},{password: hashPassword})

        doc.save();
        res.json("Password Updated")
    }else{
      res.json("Old Password is Not Valid")
    }

    

  })



export default router