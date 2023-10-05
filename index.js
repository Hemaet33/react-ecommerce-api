import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoute from './routes/product.js';
import cartRoute from './routes/cart.js';
import strpeRoute from './routes/stripe.js';
import orderRoute from './routes/order.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import cors from 'cors';
const app = express();
dotenv.config();

mongoose.connect("mongodb+srv://hemaet33:zairawasim23102000@cluster0.xkg5vl0.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("Connection successful")).catch((err)=>console.log(err));
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Credentials", true);
  next()
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://hemaet33.github.io");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.use(express.json());
app.use(cors({
  origin: "https://hemaet33.github.io",
  credentials:true
}));

app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/carts',cartRoute);
app.use('/api/orders',orderRoute);
app.use('/api/checkout',strpeRoute);


app.listen(process.env.PORT || 5000,()=>{
  console.log("Backend server is running.");
});