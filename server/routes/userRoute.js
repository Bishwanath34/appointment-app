const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const Doctor = require("../model/doctorModel");
const Appointment = require("../model/appointmentModel");
const moment = require("moment");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword, ...rest });
    await newUser.save();

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error: err });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .send({ message: "Login successful", success: true, data: token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error: err });
  }
});

// GET USER INFO BY ID (with auth)
router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    user.password = undefined;
    res.status(200).send({
      message: "User found",
      success: true,
      data: user,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error: err });
  }
});

// APPLY DOCTOR ACCOUNT
router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    const { timings } = req.body;
console.log("Received timings:", timings);
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onclickPath: "/admin/doctorsList",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error: err,
    });
  }
});

// MARK ALL NOTIFICATIONS AS SEEN
router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.seenNotifications = seenNotifications;
      user.unseenNotifications = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Error marking notifications as seen",
        success: false,
        error: err,
      });
    }
  }
);

// DELETE ALL NOTIFICATIONS
router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error clearing notifications",
      success: false,
      error: err,
    });
  }
});

// GET ALL APPROVED DOCTORS
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).send({
      message: "Approved Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error fetching doctors",
      success: false,
      err,
    });
  }
});

// CHECK BOOKING AVAILABILITY
router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    if (!doctor.timings || doctor.timings.length < 2) {
      return res.status(400).send({
        success: false,
        message: "Doctor availability timings not set correctly",
      });
    }

    const selectedStart = moment(time, "HH:mm");
    const selectedEnd = moment(time, "HH:mm").add(1, "hour");

    const doctorStart = moment(doctor.timings[0], "HH:mm");
    const doctorEnd = moment(doctor.timings[1], "HH:mm");

    if (selectedStart.isBefore(doctorStart) || selectedEnd.isAfter(doctorEnd)) {
      return res.status(200).send({
        success: false,
        message: "Time is outside doctor's available hours",
      });
    }

    const appointments = await Appointment.find({
      doctorId,
      date,
      status: { $in: ["pending", "approved"] },
    });

    const isOverlapping = appointments.some((appt) => {
      const apptStart = moment(appt.time, "HH:mm");
      const apptEnd = moment(appt.time, "HH:mm").add(1, "hour");
      return selectedStart.isBefore(apptEnd) && selectedEnd.isAfter(apptStart);
    });

    if (isOverlapping) {
      return res.status(200).send({
        success: false,
        message: "This slot is already booked.",
      });
    }

    res.status(200).send({ success: true, message: "Slot is available" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    const { doctorId, userId, doctorInfo, userInfo, date, time } = req.body;

    // Double check slot availability before booking
    const selectedStart = moment(time, "HH:mm");
    const selectedEnd = moment(time, "HH:mm").add(1, "hour");

    const appointments = await Appointment.find({
      doctorId,
      date,
      status: { $in: ["pending", "approved"] },
    });

    const isOverlapping = appointments.some((appt) => {
      const apptStart = moment(appt.time, "HH:mm");
      const apptEnd = moment(appt.time, "HH:mm").add(1, "hour");
      return selectedStart.isBefore(apptEnd) && selectedEnd.isAfter(apptStart);
    });

    if (isOverlapping) {
      return res.status(400).send({
        success: false,
        message: "Selected slot has already been booked.",
      });
    }

    const newAppointment = new Appointment({
      doctorId,
      userId,
      doctorInfo,
      userInfo,
      date,
      time,
      status: "pending",
    });

    await newAppointment.save();

    // Notify the doctor user
    const user = await User.findOne({ _id: doctorInfo.userId });
    if (user) {
      user.unseenNotifications.push({
        type: "new-appointment-request",
        message: `A new appointment request has been made by ${userInfo.name}`,
        onclickPath: "/doctor/appointments",
      });
      await user.save();
    }

    res.status(201).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Failed to book appointment", error: err.message });
  }
});

// GET APPOINTMENTS BY USER ID
router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId });
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
});

module.exports = router;
