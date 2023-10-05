import express from "express";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";
import Order from "../models/Order.js";

const router = express.Router();

//CREATE Order
router.post('/',verifyToken,async(req, res)=>{
  const Orders = await new Order(req.body);

  try {
    const newOrder = await Orders.save();
    res.status(200).json(newOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE Order
router.put('/:id',verifyTokenAndAdmin, async(req, res)=>{
  
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
      $set:req.body
    },{new:true});
    return res.status(200).json(updatedOrder)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//DELETE Order
router.delete('/:id',verifyTokenAndAdmin, async(req, res)=>{
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json("Order has been deleted")
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET Order
router.get('/find/:userId',verifyTokenAndAuthorization, async(req, res)=>{
  try {
    const order = await Order.find({userId:req.params.userId});
    return res.status(200).json(order)
  } catch (error) {
    return res.status(500).json(error)
  }
});

//GET ALL
router.get('/',verifyTokenAndAdmin, async(req,res)=>{
  try {
    const orders = await Order.find();
    res.status(200).json(orders)
  } catch (error) {
     res.status(500).json(error)
  }
});

router.get('/income',verifyTokenAndAdmin, async(req, res)=>{
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth()-1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1));
 
  try {
    const income = await Order.aggregate([
      {$match:{createdAt:{$gte:previousMonth}, ...(productId && {products:{$elemMatch:{productId}}})}},
      {$project:{month:{$month:"$createdAt"}, sales:"$amount"}},
      {$group:{_id:"$month",total:{$sum:"$sales"}}}
    ]
    )
    res.status(200).json(income)

  } catch (error) {
    res.status(500).json(error);
  }
})


export default router;