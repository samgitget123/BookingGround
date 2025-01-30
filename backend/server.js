import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/db.js';
//const groundRoutes = require('./routes/groundRoutes'); 
import groundRoutes from './routes/groundRoutes.js';
import Booking from './routes/bookingRoutes.js';
import Payment from './routes/paymentRoutes.js'
import { notfound , errorHandler } from './middleware/errorMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
const port = process.env.PORT || 5000;
connectDB();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Ground Routes
app.use('/api/ground' , groundRoutes)

//Booking Route
app.use('/api/booking' , Booking);

//payment Routes
app.use('/api/payment', Payment);

//make it for build
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/build')));
   
    app.get('*' , (req, res) => 
    res.sendFile(path.resolve(__dirname, '../frontend', 'build' , 'index.html')));
}else{
    app.get('/', (req , res) => {
        res.send('Api is Running.....');
    });
}
//Error handlers
app.use(notfound);
app.use(errorHandler);

app.listen(port , ()=> console.log(`server running on port ${port}`));