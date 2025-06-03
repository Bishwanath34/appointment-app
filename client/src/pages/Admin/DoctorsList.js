
import React from 'react'
import Layout from '../../components/Layout'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { hideloading, showloading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Table } from 'antd';
import {toast} from 'react-hot-toast'
import moment from 'moment'
function DoctorsList() {
  const [doctors,setDoctors]=useState([])
      const dispatch=useDispatch();
      const getDoctorsData=async()=>{
  try{
  dispatch(showloading());  
  const response = await axios.get('https://appointment-app-ser.onrender.com/api/admin/get-all-doctors', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  dispatch(hideloading());
  if(response.data.success){
      setDoctors(response.data.data);
  }
  }catch(err){
  dispatch(hideloading());
   console.error('Error fetching users:', err.response?.data || err.message);
  }
}
 const changeDoctorStatus=async(record,status)=>{
  try{
  dispatch(showloading());  
  const response = await axios.post('https://appointment-app-ser.onrender.com/api/admin/change-doctor-account-status',{doctorId:record._id,userId:record.userId,status:status}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  dispatch(hideloading());
  if(response.data.success){
    toast.success(response.data.message);
    getDoctorsData();
  }
  }catch(err){
    toast.error("Error changing doctor account status");
  dispatch(hideloading());
   console.error('Error fetching users:', err.response?.data || err.message);
  }
}
   useEffect(()=>{
  getDoctorsData();
      },[]);
  const columns=[
        {
            title:'Name',
            dataIndex:'name',
             render:(text,record)=>(
               <span>{record.firstName} {record.lastName}</span>
            ),
        },
        {
            
            title:'Phone',
            dataIndex:'phoneNumber',
        },
        {
            
            title:'Created At',
            dataIndex:'createdAt',
            render:(record,text)=> moment(record.createdAt).format("DD-MM-YYYY"),
            
        },
        {
            
            title:'Status',
            dataIndex:'status',
        },
        {
            
            
            title:'Actions',
            dataIndex:'actions',
            render:(text,record)=>(
                <div className='d-flex'>
{record.status==="pending" && <h1 className='anchor' onClick={()=>changeDoctorStatus(record,'approved')}>Approve</h1>}
{record.status==="approved" && <h1 className='anchor' onClick={()=>changeDoctorStatus(record,'blocked')}>Block</h1>}

                </div>
            ),
        },
        
        
    ];
    
  return (
    <Layout>  
      <h1 className='page-header'>DoctorsList</h1>
      <Table columns={columns} dataSource={doctors} rowKey={(record) => record._id}>

      </Table>
    </Layout>
  
  )
}

export default DoctorsList
