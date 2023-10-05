import express from "express";
import bcrypt from "bcrypt";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

//UPDATE USER
router.patch('/:id',verifyTokenAndAuthorization, async(req, res)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
      $set:req.body
    },{new:true});
    return res.status(200).json(updatedUser)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//DELETE USER
router.delete('/:id',verifyTokenAndAuthorization, async(req, res)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User has been deleted")
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET USER ONLY BY ADMIN
router.get('/find/:id',verifyTokenAndAdmin, async(req, res)=>{
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET ALL USERS
router.get('/',verifyTokenAndAdmin, async(req,res)=>{
  const query = req.query.new;
  try {
    const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET USER STATS
router.get('/stats',verifyTokenAndAdmin,async(req, res)=>{
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
  
  try {
    const data = await User.aggregate([
      {$match: {createdAt: {$gte:lastYear}}},
      {$project:{month:{$month:"$createdAt"}}},
      {$group:{_id:"$month",total:{$sum:1}}}
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;