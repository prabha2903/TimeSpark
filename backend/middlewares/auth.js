import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = 'd317c57ed116cda8';

export async function authMiddleware(req, res, next) { 
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
         message: 'Unauthorized' });
}
const token = authHeader.split(' ')[1];

// to verify and attach the user obj
try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
        return res.status(401).json({ 
            success: false,
            message: 'Unauthorized' });
    }
    req.user = user;
    next();
} catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ 
        success: false,
        message: 'Invalid token' });
}
}