import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Navigate, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { setUser} from '../redux/userSlice';
import { hideloading, showloading } from '../redux/alertsSlice';
const ProtectedRoutes = (props) => {
    const dispatch=useDispatch();
    const {user,reloadUser}=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const getUser=async()=>{
try{
    dispatch(showloading());
const response=await axios.post('https://appointment-app-ser.onrender.com/api/user/get-user-info-by-id',{token:localStorage.getItem('token')},{
    headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
    }
})
dispatch(hideloading());
if(response.data.success){
dispatch(setUser(response.data.data));
}else{
    localStorage.clear();
    navigate("/login");
}
}catch(err){
 
 dispatch(hideloading());
 localStorage.clear();
navigate("/login");
}
    }
 useEffect(()=>{
if(!user||reloadUser){
    getUser()
}
 },[user,reloadUser]);



    if(localStorage.getItem('token')){
return props.children;
    }else{
return <Navigate to="/login" />;
    }
  
}

export default ProtectedRoutes
