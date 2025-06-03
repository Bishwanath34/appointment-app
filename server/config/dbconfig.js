const mongoose=require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL);

const connection=mongoose.connection;
connection.on('connected',()=>{
    console.log("mongodb connected...");
})
connection.on('error',(err)=>{
    console.log("Errorin MongoDb connection...",err);
})
module.exports=mongoose;