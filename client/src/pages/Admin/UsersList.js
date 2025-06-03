import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { hideloading, showloading } from '../../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment'
import { Table } from 'antd';
function UsersList() {
    const [users,setUsers]=useState([])
    const dispatch=useDispatch();
    const getUsersData=async()=>{
try{
dispatch(showloading());
console.log('Token:', localStorage.getItem('token'));

const response = await axios.get('https://appointment-app-2.onrender.com/api/admin/get-all-users', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
    'Content-Type': 'application/json'
  },
});
dispatch(hideloading());
if(response.data.success){
    setUsers(response.data.data);
}
}catch(err){
dispatch(hideloading());
 console.error('Error fetching users:', err.response?.data || err.message);
}
    }
    useEffect(()=>{
getUsersData();
    },[]);
    const columns=[
        {
            title:'Name',
            dataIndex:'name',
        },{
            title:'Email',
            dataIndex:'email',
        },{
            
            title:'Created At',
            dataIndex:'createdAt',
            render:(record,text)=> moment(record.createdAt).format("DD-MM-YYYY"),
        },{
            
            
            title:'Actions',
            dataIndex:'actions',
            render:(text,record)=>(
                <div className='d-flex'>
<h1 className='anchor'>Block</h1>
                </div>
            ),
        },
        
        
    ];
  return (
    <Layout>
            <h1 className='page-header'>UsersList</h1>
            <Table columns={columns} dataSource={users} rowKey={(record) => record._id}></Table>
    </Layout>
  )
}

export default UsersList