import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ApplyDoctor from './pages/ApplyDoctor'
import ProtectedRoutes from './components/ProtectedRoutes';
import Notifications from './pages/Notifications';
import UsersList from './pages/Admin/UsersList';
import DoctorsList from  './pages/Admin/DoctorsList'
import Profile from './pages/Doctor/Profile';
import BookAppointment from './pages/BookAppointment';
import Appointment from './pages/Appointment';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
function App() {
  const { loading } = useSelector(state => state.alerts);

  return (
    <BrowserRouter>
      {loading && (
        <div className='spinner-parent'>
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
        <Route path='/apply-doctor' element={<ProtectedRoutes><ApplyDoctor/></ProtectedRoutes>} />
        <Route path='/notifications' element={<ProtectedRoutes><Notifications/></ProtectedRoutes>} />
<Route path='/admin/usersList' element={<ProtectedRoutes><UsersList/></ProtectedRoutes>} />
<Route path='/admin/doctorsList' element={<ProtectedRoutes><DoctorsList/></ProtectedRoutes>} />
<Route path='/doctor/profile/:userId' element={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
<Route path='/book-appointment/:doctorId' element={<ProtectedRoutes><BookAppointment/></ProtectedRoutes>} />
<Route path='/appointments' element={<ProtectedRoutes><Appointment/></ProtectedRoutes>} />
<Route path='/doctor/appointments' element={<ProtectedRoutes><DoctorAppointments/></ProtectedRoutes>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
