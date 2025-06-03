const express=require('express');
const app=express();
const dbconfig=require('./config/dbconfig');
const doctorRoute=require('./routes/doctorRoute');

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://appointment-booking-518f.onrender.com' 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
const userRoute=require('./routes/userRoute');
const adminRoute=require('./routes/adminRoute');
app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
app.use('/api/doctor',doctorRoute);
require('dotenv').config();

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Node server started at port${PORT}`);
})
