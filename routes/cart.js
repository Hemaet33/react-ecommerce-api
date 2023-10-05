import express from "express";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";
import Cart from "../models/Cart.js";

const router = express.Router();

//CREATE Cart
router.post('/',verifyToken,async(req, res)=>{
  const Carts = await new Cart(req.body);

  try {
    const newCart = await Carts.save();
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE Cart
router.put('/:id',verifyTokenAndAuthorization, async(req, res)=>{
  
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
      $set:req.body
    },{new:true});
    return res.status(200).json(updatedCart)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//DELETE Cart
router.delete('/:id',verifyTokenAndAuthorization, async(req, res)=>{
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json("Cart has been deleted")
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET Cart
router.get('/find/:userId',verifyTokenAndAuthorization, async(req, res)=>{
  try {
    const Cart = await Cart.find({userId:req.params.userId});
    return res.status(200).json(Cart)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET ALL
router.get('/',verifyTokenAndAdmin, async(req,res)=>{
  try {
    const carts = await Cart.find();
    res.status(200).json(carts)
  } catch (error) {
     res.status(500).json(error)
  }
});


export default router;