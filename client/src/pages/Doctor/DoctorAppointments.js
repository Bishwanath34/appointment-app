import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { hideloading, showloading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showloading());
      const response = await axios.get(
        "https://appointment-app-ser.onrender.com/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      dispatch(hideloading());
      console.error("Error fetching appointments:", err.response?.data || err.message);
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "https://appointment-app-ser.onrender.com/api/doctor/change-appointment-status",
        {
          appointmentId: record._id,
          status: status,
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
        getAppointmentsData(); // Refresh list
      }
    } catch (err) {
      toast.error("Error changing appointment status");
      dispatch(hideloading());
      console.error("Error:", err.response?.data || err.message);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record?.userInfo?.name || "N/A"}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record?.userInfo?.phoneNumber || "N/A"}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date, "DD-MM-YYYY").format("DD-MM-YYYY")}{" "}
          {moment(record.time, "HH:mm").format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) =>
        record.status === "pending" && (
          <div className="d-flex">
            <h1
              className="anchor px-2"
              onClick={() => changeAppointmentStatus(record, "approved")}
            >
              Approve
            </h1>
            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, "rejected")}
            >
              Reject
            </h1>
          </div>
        ),
    },
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey={(record) => record._id}
      />
    </Layout>
  );
}

export default DoctorAppointments;
