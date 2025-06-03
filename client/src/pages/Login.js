import React from 'react'
import { Link } from 'react-router-dom'
import {Button, Form,Input} from 'antd'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSelector,useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom'
import { hideloading, showloading } from '../redux/alertsSlice'
const Login = () => {
   const dispatch=useDispatch();
    const navigate=useNavigate();
    const onFinish=async(values)=>{
         try{
            dispatch(showloading());
        const response=await axios.post('/api/user/login',values);
        dispatch(hideloading());
        if(response.data.success){
        toast.success(response.data.message);
        console.log("🏷️  Received token:", response.data.data);
        localStorage.setItem("token",response.data.data);
        navigate("/");
        }else{
            toast.error(response.data.message);
        
        }
               }catch(err){
                dispatch(hideloading());
        toast.error("something went wrong");
               }
    }
  return (
    <div className='authentication'>
        <div className='authentication-form card p-3'>
            <h1 className='card-title'>Welcome Back</h1>
            <Form layout='vertical' onFinish={onFinish}>

<Form.Item label='Email' name='email'>
    <Input placeholder='Email' type='email'/>
</Form.Item>
<Form.Item label='Password' name='password'>
    <Input placeholder='Password' type='password'/>
</Form.Item>
            <Button className='primary-button mt-2' htmlType='submit'>LOGIN</Button>
            </Form>
            <Link to='/register' className='anchor mt-2'>CLICK HERE TO REGISTER</Link>
        </div>
    </div>
  )
}

export default Login