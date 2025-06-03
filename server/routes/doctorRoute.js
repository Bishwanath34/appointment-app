const express = require("express");
const router = express.Router();
const Doctor = require("../model/doctorModel");
const Appointment = require("../model/appointmentModel");
const User = require("../model/userModel");
const authMiddleware = require("../middleware/authMiddleware");

// Get doctor info by user ID
router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });

    res.status(200).send({
      message: "Doctor info fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error("Error in /get-doctor-info-by-user-id:", err);
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error: err,
    });
  }
});

// Get doctor info by doctor ID
router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });

    res.status(200).send({
      message: "Doctor info fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error("Error in /get-doctor-info-by-id:", err);
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error: err,
    });
  }
});

// Update doctor profile
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true }
    );

    res.status(200).send({
      message: "Doctor info updated successfully",
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error("Error in /update-doctor-profile:", err);
    res.status(500).send({
      message: "Error updating doctor info",
      success: false,
      error: err,
    });
  }
});

// Get appointments by doctor ID
router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });

    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (err) {
    console.error("Error in /get-appointments-by-doctor-id:", err);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      err,
    });
  }
});

// Change appointment status
router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });
    user.unseenNotifications.push({
      type: "appointment-status-change",
      message: `Your appointment has been ${status}`,
      onclickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in /change-appointment-status:", err);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      err,
    });
  }
});

module.exports = router;
