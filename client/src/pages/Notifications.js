import React from 'react'
import Layout from '../components/Layout'
import { Tabs} from 'antd' 
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { hideloading, showloading } from '../redux/alertsSlice'
import axios from 'axios';
import toast from 'react-hot-toast'
import { setUser } from '../redux/userSlice';
function Notifications() {
    const {user}=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const markAllAsSeen=async ()=>{
try{
        dispatch(showloading);
const response=await axios.post('/api/user/mark-all-notifications-as-seen',{userId:user._id},{
    headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
    }
});
dispatch(hideloading);
if(response.data.success){
toast.success(response.data.message);
dispatch(setUser(response.data.data));
}else{
    toast.error(response.data.message);

}
       }catch(err){
        dispatch(hideloading);
toast.error("something went wrong");
       }
    }
    const DeleteAll=async ()=>{
try{
        dispatch(showloading);
const response=await axios.post('/api/user/delete-all-notifications',{userId:user._id},{
    headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
    }
});
dispatch(hideloading);
if(response.data.success){
toast.success(response.data.message);
dispatch(setUser(response.data.data));
}else{
    toast.error(response.data.message);

}
       }catch(err){
        dispatch(hideloading);
toast.error("something went wrong");
       }
    }
  return (
    <Layout>
        <h1 className='page-title'>Notifications</h1>
        <Tabs>
<Tabs.TabPane tab='Unseen' key={0}>
<div className='d-flex justify-content-end'>
    <h1 className='anchor' onClick={()=>markAllAsSeen()}>Mark all as seen</h1>
    </div>
    {user?.unseenNotifications.map((notification,index)=>(
        <div className='card p-2 mt-2' onClick={()=>navigate(notification.onclickPath)} key={index}>
            <div className='card-text'>{notification.message}</div>
        </div>
    ))}
</Tabs.TabPane>
<Tabs.TabPane tab='seen' key={1}>
<div className='d-flex justify-content-end'>
    <h1 className='anchor' onClick={DeleteAll}>Delete All</h1>
</div>
 {user?.seenNotifications.map((notification,index)=>(
        <div className='card p-2 mt-2' onClick={()=>navigate(notification.onclickPath)} key={index}>
            <div className='card-text'>{notification.message}</div>
        </div>
    ))}
</Tabs.TabPane>
        </Tabs>
    </Layout>
  )
}

export default Notifications