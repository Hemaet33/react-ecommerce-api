import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/User.js';

const router = express.Router();

//REGISTER
router.post('/register',async(req, res)=>{
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);
  const newUser = await new User({
    username:req.body.username,
    email:req.body.email,
    password:hashedPassword
  });
  
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }

});

//LOGIN
router.post('/login', async(req, res)=>{
  try {
    const user = await User.findOne({username:req.body.username});
    !user && res.status(401).json("User not found");
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    !validPassword && res.status(401).json("Password doesn't match");

    const accessToken = jwt.sign({id:user._id, isAdmin:user.isAdmin}, process.env.JWT_SEC,{expiresIn:"3d"});

    const {password,...others}=user._doc;
    res.status(200).json({...others,accessToken});
  } catch (error) {
    res.status(500).json(error);
  }
});


export default router;