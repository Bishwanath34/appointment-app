import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Button, Form,Input} from 'antd'
import axios from 'axios'
import Login from './Login'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { hideloading, showloading } from '../redux/alertsSlice'
const Register = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const onFinish=async(values)=>{
       try{
        dispatch(showloading);
const response=await axios.post('/api/user/register',values);
dispatch(hideloading);
if(response.data.success){
toast.success(response.data.message);
toast("Redirecting to login page");
navigate("/login");
}else{
    toast.error(response.data.message);

}
       }catch(err){
        dispatch(hideloading);
toast.error("something went wrong");
       }
    }
  return (
    <div className='authentication'>
        <div className='authentication-form card p-3'>
            <h1 className='card-title'>Nice To Meet U</h1>
            <Form layout='vertical' onFinish={onFinish}>
<Form.Item label='Name' name='name'>
    <Input placeholder='Name'/>
</Form.Item>
<Form.Item label='Email' name='email'>
    <Input placeholder='Email' type='email'/>
</Form.Item>
<Form.Item label='Password' name='password'>
    <Input placeholder='Password' type='password'/>
</Form.Item>
            <Button className='primary-button mt-2' htmlType='submit'>REGISTER</Button>
            </Form>
            <Link to='/login' className='anchor mt-2'>CLICK HERE TO LOGIN</Link>
        </div>
    </div>
  )
}

export default Register