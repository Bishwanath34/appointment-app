const express=require('express');
const app=express();
const dbconfig=require('./config/dbconfig');
const doctorRoute=require('./routes/doctorRoute');

// server.js
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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