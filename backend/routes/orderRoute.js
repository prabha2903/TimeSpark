import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { confirmPayment, createOrder, deleteOrder, getOrders, getUserOrders, updateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post("/", authMiddleware, createOrder);
orderRouter.post("/confirm-payment", authMiddleware, confirmPayment);

orderRouter.get("/my", authMiddleware, getUserOrders);
orderRouter.get('/',getOrders);
orderRouter.put('/:id',updateOrder);
orderRouter.delete('/:id',deleteOrder);
export default orderRouter;