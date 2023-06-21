import express from "express"
import Order from "../models/OrderModel.js"
const router = express.Router()


router.post('/',async (req,res) => {

    const {email,products,address,amount,paymentMethod} = req.body
     
    

    if(!products){
        res.status(400).json({error: "Please Add Product"})
    }else{

        const order = new Order({
            email,
            products,
            address,
            amount,
            paymentMethod
          })
      
          const createdOrder = await order.save()
           
          res.status(201).json(createdOrder)
    }
    
})
router.get('/my/allorders',async (req,res) => {
    try {
        const orders = await Order.find({})
        res.status(200).json(orders)
    } catch (error) {
        res.status(404).json({error: error})
    }
})

router.get('/:order_id',async (req,res) => {

    try {
        const orderDetails = await Order.findById(req.params.order_id)

        res.status(200).json(orderDetails)
    } catch (error) {
        res.status(404).json({error: error})
    }

  

})






export default router