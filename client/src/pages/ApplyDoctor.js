import React from 'react'
import Layout from '../components/Layout'
import {Form,Row,Col,Input, Button} from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { Space, TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showloading,hideloading } from '../redux/alertsSlice';
import {toast} from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import moment from 'moment'
function ApplyDoctor() {
    const dispatch=useDispatch();
    const {user}=useSelector(state=>state.user);
const navigate=useNavigate();
  const onFinish = async (values) => {
  try {
    dispatch(showloading());

    // Make sure timings exist and are moment objects, then format
    const formattedTimings = Array.isArray(values.timings) && values.timings.length === 2
      ? [
          values.timings[0].format("HH:mm"),
          values.timings[1].format("HH:mm"),
        ]
      : [];

    const response = await axios.post(
      "https://appointment-app-ser.onrender.com/api/user/apply-doctor-account",
      {
        ...values,
        userId: user._id,
        timings: formattedTimings,
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
      navigate("/");
    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    dispatch(hideloading());
    toast.error("Something went wrong");
  }
};

  return (
<Layout>
    <h1 className='page-title'>Apply-Doctor</h1>
    <hr></hr>
   <DoctorForm onFinish={onFinish}></DoctorForm>
    
</Layout>
    
  )
}

export default ApplyDoctor
