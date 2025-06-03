const express = require('express');
const User = require('../model/userModel');
const Doctor=require('../model/doctorModel');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
router.get("/get-all-doctors",authMiddleware,async(req,res)=>{
    try{
const doctors=await Doctor.find({});
res.status(200).send({
    message:"Doctors fetched successfully",
    success:true,
    data:doctors,
});
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error fetching doctors",
            success:false,
            err,
        });
    }
})
router.get("/get-all-users",authMiddleware,async(req,res)=>{
    try{
const users=await User.find({});
res.status(200).send({
    message:"Users fetched successfully",
    success:true,
    data:users,
});
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error fetching users",
            success:false,
            err,
        });
    }
})
router.post("/change-doctor-account-status",authMiddleware,async(req,res)=>{
    try{
const {doctorId,status}=req.body;
const doctor=await Doctor.findByIdAndUpdate(doctorId,{
    status,
});
const user=await User.findOne({_id:doctor.userId});
    const unseenNotifications=user.unseenNotifications;
    unseenNotifications.push({
      type:"new-doctor-request-changed",
      message:`Your doctor account  has been ${status}`,
      
      onclickPath:"/notifications",
    })
    user.isDoctor=status==="approved" ? true : false;
    await user.save();
        res.status(200).send({
        message:"Doctor status updated successfully",
        success:true,
        data: doctor,
    });
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:"Updating Error",
            success:false,
            err,
        });
    }
})
module.exports=router;