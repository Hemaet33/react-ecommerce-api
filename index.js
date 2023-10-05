import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoute from './routes/product.js';
import cartRoute from './routes/cart.js';
import strpeRoute from './routes/stripe.js';
import orderRoute from './routes/order.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import cors from 'cors'
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Connection successful")).catch((err)=>console.log(err));
app.use(express.json())

app.use(cors())

app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/carts',cartRoute);
app.use('/api/orders',orderRoute);
app.use('/api/checkout',strpeRoute);


app.listen(process.env.PORT || 5000,()=>{
  console.log("Backend server is running.");
});