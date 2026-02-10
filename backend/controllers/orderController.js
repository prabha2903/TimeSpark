import Order from "../models/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from auth:", req.user);

    const { name, email, phoneNumber, address, notes, paymentMethod, items } = req.body;

    // Check required fields
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    if (!name || !email || !phoneNumber || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone number and address are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // Normalize items safely
    const normalizedItems = items.map((it) => ({
      productId: String(it.productId ?? it._id ?? ""),
      name: String(it.name ?? "Unnamed Product"),
      img: it.img ?? null,
      price: Number(it.price ?? 0),
      qty: Number(it.qty ?? 1),
      description: String(it.description ?? ""),
    }));

    const subtotal = normalizedItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const taxRate = 0.08;
    const taxAmount = +(subtotal * taxRate).toFixed(2);
    const shippingCharge = 0;
    const finalAmount = +(subtotal + taxAmount + shippingCharge).toFixed(2);

    const orderId = `ORD-${uuidv4()}`;
    let razorpayOrder = null;

    // Only create Razorpay order if payment method is online
    if (paymentMethod === "Online") {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ success: false, message: "Razorpay credentials missing" });
      }

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(finalAmount * 100), // in paise
          currency: "INR",
          receipt: orderId,
        });
      } catch (razorErr) {
        console.error("Razorpay order creation error:", razorErr);
        return res.status(500).json({ success: false, message: "Razorpay order creation failed" });
      }
    }

    // Save order to DB
    const order = await Order.create({
      orderId,
      user: req.user._id,
      name,
      email,
      phoneNumber,
      address,
      items: normalizedItems,
      shippingCharge,
      totalAmount: subtotal,
      taxAmount,
      finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "Online" ? "Unpaid" : "Pending",
      razorpayOrderId: razorpayOrder?.id,
      notes,
    });

    return res.status(201).json({
      success: true,
      order,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   CONFIRM PAYMENT
========================= */
export const confirmPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment data",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { paymentStatus: "Paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("confirmPayment error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
export const getOrders = async (req, res) => {
  try {
    const { search = "", status } = req.query;
    const filter = {};

    if (status) filter.orderStatus = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { orderId: regex },
        { name: regex },
        { email: regex },
        { "items.name": regex },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders });
  } catch (err) {
    console.error("getOrders error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   GET USER ORDERS
========================= */
export const getUserOrders = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("getUserOrders error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrder = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) return res.status(400).json({ success: false, message: "Order status required" });

    const updated = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, message: "Order updated", order: updated });
  } catch (err) {
    console.error("updateOrder error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   DELETE ORDER
========================= */
export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, message: "Order deleted" });
  } catch (err) {
    console.error("deleteOrder error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
