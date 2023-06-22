import express, { application } from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import pincodeRoutes from './routes/pincodeRoutes.js'
import path from 'path'


dotenv.config();

connectDB();





const app = express()
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/upload/images")));
app.use(express.json())
app.use('/api/products',productRoutes)
app.use('/api/auth',userRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/pincodes',pincodeRoutes)

app.listen(5000,console.log('server running on port 5000'))