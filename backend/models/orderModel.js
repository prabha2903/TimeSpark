import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

/* Item Schema */
const itemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    img: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, default: 1, min: 1 },
   description: { type: String, required: true, default: "No description provided" }
  },
  { _id: false }
);

/* Order Schema */
const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },

    items: { type: [itemSchema], required: true },

    shippingCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["Online", "Cash On Delivery"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid","Unpaid"],
      default: "Unpaid",
    },

    /* Razorpay fields */
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },

    notes: { type: String },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
