import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://prabha29070607_db_user:prabhapounraj07@cluster0.ke7c2tm.mongodb.net/WATCHSTORE")
    .then(()=>console.log('DB CONNECTED'))
}   