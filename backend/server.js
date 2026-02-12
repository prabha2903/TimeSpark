import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import path from 'path';
import useRouter from './routes/userRoute.js';
import watchRouter from './routes/watchRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();
const app =express();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
//DB
connectDB();
// Routes
app.use('/api/auth',useRouter)
app.use('/uploads',express.static(path.join(process.cwd(),'uploads')));
app.use('/api/watches',watchRouter);
app.use('/api/cart',cartRouter);
app.use('/api/orders',orderRouter);

app.get('/',(req,res)=>{
    res.send("API WORKING");
})



app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});