import express from "express"
import {instance }from '../config/razorpay.js'
import Order from "../models/OrderModel.js"
import crypto from 'crypto'






const router = express.Router()


router.post('/',async (req, res) => {
   
   const {amount,_id} = req.body

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
      }
    
      try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        // console.log(paymentResponse)
        res.json({
          success: true,
          data: paymentResponse,
        })
      } catch (error) {
        console.log(error)
        res
          .status(500)
          .json({ success: false, message: "Could not initiate order." })
      }


})



router.post('/verifyPayment',async (req, res) => {

 
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
 



  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature 
    
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    const doc = await Order.findOneAndUpdate({_id: req.body.orderId}, {status: 'PAID'}, {
      new: true
    });
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}
)



export default router