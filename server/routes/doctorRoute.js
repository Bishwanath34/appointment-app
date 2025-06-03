const express = require("express");
const router = express.Router();
const Doctor = require("../model/doctorModel");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../model/appointmentModel");
const User=require('../model/userModel');
router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });

    res.status(200).send({
      message: "Doctor info fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (err) {
    res
      .status(500)
      .send({
        message: "Error getting doctor info",
        success: false,
        error: err,
      });
  }
});
router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });

    res.status(200).send({
      message: "Doctor info fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (err) {
    res
      .status(500)
      .send({
        message: "Error getting doctor info",
        success: false,
        error: err,
      });
  }
});
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.userId },
      req.body
    );

    res.status(200).send({
      message: "Doctor info updated successfully",
      success: true,
      data: doctor,
    });
  } catch (err) {
    res
      .status(500)
      .send({
        message: "Error updating doctor info",
        success: false,
        error: err,
      });
  }
});
router.get( "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.userId });
      const appointments = await appointment.find({ doctorId: doctor._id });
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        err,
      });
    }
  }
);
router.post("/change-appointment-status",authMiddleware,async(req,res)=>{
    try{
const {appointmentId,status}=req.body;
const appointment=await Appointment.findByIdAndUpdate(appointmentId,{
    status,
});
const user=await User.findOne({_id:appointment.userId});
    const unseenNotifications=user.unseenNotifications;
    unseenNotifications.push({
      type:"appointment-status-change",
      message:`Your appointment account  has been ${status}`,
      
      onclickPath:"/appointments",
    })
    await user.save();
        res.status(200).send({
        message:"Appointment status updated successfully",
        success:true,
    });
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:" Error changing appointment status",
            success:false,
            err,
        });
    }
})
module.exports = router;
