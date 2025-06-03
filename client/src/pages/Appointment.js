import React from 'react'
import Layout from '../components/Layout'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { hideloading, showloading } from '../redux/alertsSlice';
import axios from 'axios';
import { Table } from 'antd';
import {toast} from 'react-hot-toast'
import moment from 'moment'
function Appointment() {
    const [appointments,setAppointments]=useState([])
          const dispatch=useDispatch();
          const getAppointmentsData=async()=>{
      try{
      dispatch(showloading());  
      const response = await axios.get('https://appointment-app-2.onrender.com/api/user/get-appointments-by-user-id', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideloading());
      if(response.data.success){
          setAppointments(response.data.data);
      }
      }catch(err){
      dispatch(hideloading());
       console.error('Error fetching users:', err.response?.data || err.message);
      }
    }
    const columns=[
        {
title:"Id",
dataIndex:"_id",
        },
        {
            title:'Doctor',
            dataIndex:'name',
             render:(text,record)=>(
               <span>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</span>
            ),
        },
        {
            
            title:'Phone',
            dataIndex:'phoneNumber',
             render:(text,record)=>(
               <span>{record.doctorInfo.phoneNumber}</span>
            ),
        },
        {
            
            title:'Date & Time',
            dataIndex:'createdAt',
             render:(text,record)=>(
<span>
  {moment(record.date, "DD-MM-YYYY").format("DD-MM-YYYY")}{" "}
  {moment(record.time, "HH:mm").format("HH:mm")}
</span>
            ),
        }, 
        {
            title:"status",
            dataIndex:"status",
        }
    ];
    
    useEffect(()=>{
    getAppointmentsData();
    },[]);
  return (
   <Layout>  
      <h1 className='page-header'>Appointments</h1>
      <Table columns={columns} dataSource={appointments} rowKey={(record) => record._id}>

      </Table>
    </Layout>
  )
}

export default Appointment
