import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    products: [
      {
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: String,
          required: true
        },
      },
    ],
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: "Pending" },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
      },
      paymentMethod: {
        type: String,
        required: true,
      }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema)

export default Order