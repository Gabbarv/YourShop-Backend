import express, { application } from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import pincodeRoutes from './routes/pincodeRoutes.js'
import paymentRoutes from  './routes/paymentRoutes.js'
import cors from 'cors'
import { fileURLToPath } from 'url';
import path from 'path'




dotenv.config();

connectDB();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use('/api/products',productRoutes)
app.use('/api/auth',userRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/pincodes',pincodeRoutes)
app.use('/api/payment',paymentRoutes)


app.listen(5000,console.log('server running on port 5000'))