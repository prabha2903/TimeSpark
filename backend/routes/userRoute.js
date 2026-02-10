import express from 'express';
import { login,register } from '../controllers/userController.js';
const useRouter = express.Router();
useRouter.post('/register', register);
useRouter.post('/login', login);
export default useRouter;
