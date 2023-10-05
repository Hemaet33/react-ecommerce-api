import express from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";
import Product from "../models/Product.js";

const router = express.Router();

//CREATE PRODUCT
router.post('/',verifyTokenAndAdmin,async(req, res)=>{
  const products = await new Product(req.body);

  try {
    const newproduct = await products.save();
    res.status(200).json(newproduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE Product
router.patch('/:id',verifyTokenAndAdmin, async(req, res)=>{
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
      $set:req.body
    },{new:true});
    return res.status(200).json(updatedProduct)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//DELETE Product
router.delete('/:id',verifyTokenAndAdmin, async(req, res)=>{
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("Product has been deleted")
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET Product
router.get('/find/:id', async(req, res)=>{
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET ALL ProductS
router.get('/', async(req,res)=>{
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if(queryNew){
      products = await Product.find().sort({createdAt:-1}).limit(5);
    }else if(queryCategory){
      products = await Product.find({categories:{$in:queryCategory}});
    }else{
      products = await Product.find();
    }
     res.status(200).json(products)
  } catch (error) {
     res.status(500).json(error)
  }
});


export default router;