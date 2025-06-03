import React, { useEffect, useState } from 'react'
import axios from 'axios'
import  Layout  from '../components/Layout'
import { Row,Col } from 'antd'; 
import Doctor from '../components/Doctor';
import { useDispatch } from 'react-redux';
import { hideloading, showloading } from '../redux/alertsSlice';
const Home = () => {
  const [doctors,setDoctors]=useState([]);
  const dispatch=useDispatch();
  const getData=async()=>{
    try{
      dispatch(showloading());
const response=await axios.get('https://appointment-app-2.onrender.com/api/user/get-all-approved-doctors',
  {
    headers:{
     Authorization: `Bearer ${localStorage.getItem('token')}`

    }
  } 
);
dispatch(hideloading());
if(response.data.success){
  setDoctors(response.data.data);
}
    }catch(err){
      dispatch(hideloading());
    }
  }
  useEffect(()=>{
    getData();
  },[]);
  return (
   <Layout>
    <Row gutter={20}>{doctors.map((doctor)=>(<Col span={8} xs={24} sm={24} lg={8}>
    <Doctor doctor={doctor}></Doctor>
    </Col>))}</Row>
   </Layout>
  )
}

export default Home
