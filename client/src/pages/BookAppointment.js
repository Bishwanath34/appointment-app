import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import bookingImage from "./bookingimg.jpg"; // same folder

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null); // will hold string "DD-MM-YYYY"
  const [time, setTime] = useState(null); // will hold string "HH:mm"
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showloading());

      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideloading());

      if (response.data.success) {
        const doctorData = response.data.data;

        // Convert timings only for display (Moment objects)
        if (
          Array.isArray(doctorData.timings) &&
          doctorData.timings.length === 2 &&
          doctorData.timings[0] &&
          doctorData.timings[1]
        ) {
          doctorData.timings = [
            moment(doctorData.timings[0], "HH:mm"),
            moment(doctorData.timings[1], "HH:mm"),
          ];
        }

        setDoctor(doctorData);
      }
    } catch (err) {
      dispatch(hideloading());
      toast.error("Failed to fetch doctor data");
    }
  };

  const checkAvailability = async () => {
    if (!date || !time) {
      toast.error("Please select both date and time.");
      return;
    }

    try {
      dispatch(showloading());

      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date, // sending "DD-MM-YYYY" string directly
          time, // sending "HH:mm" string directly
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideloading());

      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
        setIsAvailable(false);
      }
    } catch (err) {
      toast.error("Error checking availability");
      dispatch(hideloading());
    }
  };

  const bookNow = async () => {
    if (!date || !time) {
      toast.error("Please select both date and time.");
      return;
    }

    if (!isAvailable) {
      toast.error("Please check availability before booking.");
      return;
    }

    try {
      dispatch(showloading());

      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date, // "DD-MM-YYYY"
          time, // "HH:mm"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideloading());

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      }
    } catch (err) {
      toast.error("Error booking appointment");
      dispatch(hideloading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">
            <Col span={8} sm={24} xs={24} lg={8}>
              <img src={bookingImage} alt="" width="100%" height="300" />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings: </b>
                {doctor.timings[0].format("hh:mm A")} -{" "}
                {doctor.timings[1].format("hh:mm A")}
              </h1>
              <p>
                <b>Phone Number: </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address: </b>
                {doctor.address}
              </p>
              <p>
                <b>Fee per Visit: </b>
                {doctor.feePerConsultation}
              </p>
              <p>
                <b>Website: </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    if (value) {
                      setDate(value.format("DD-MM-YYYY")); // formatted string
                    } else {
                      setDate(null);
                    }
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    if (value) {
                      setTime(value.format("HH:mm")); // formatted string
                    } else {
                      setTime(null);
                    }
                    setIsAvailable(false);
                  }}
                />
                <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>
                <Button
                  disabled={!isAvailable}
                  className="primary-button mt-3 full-width-button"
                  onClick={bookNow}
                >
                  Book Now
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
