import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import DoctorForm from '../../components/DoctorForm';
import { useDispatch, useSelector } from 'react-redux';
import { showloading, hideloading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  const onFinish = async (values) => {
    try {
      dispatch(showloading());
      
      // Validate timings
      if (!values.timings || values.timings.length !== 2) {
        toast.error('Please select valid timings');
        return;
      }

      const payload = {
        ...values,
        userId: user._id,
        timings: [
          values.timings[0].format('HH:mm'),
          values.timings[1].format('HH:mm'),
        ],
        feePerConsultation: Number(values.feePerConsultation),
        experience: String(values.experience),
      };

      const response = await axios.post(
        '/api/doctor/update-doctor-profile',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      dispatch(hideloading());

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      dispatch(hideloading());
      toast.error('Something went wrong');
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        '/api/doctor/get-doctor-info-by-user-id',
        { userId: params.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      dispatch(hideloading());

      if (response.data.success) {
        let doctorData = response.data.data;
        
        // Set default timings if not present
        if (!doctorData.timings || doctorData.timings.length !== 2) {
          doctorData.timings = ["09:00", "17:00"];
        }
        
        // Convert to moments
        doctorData.timings = [
          moment(doctorData.timings[0], 'HH:mm'),
          moment(doctorData.timings[1], 'HH:mm')
        ];

        setDoctor(doctorData);
      }
    } catch (err) {
      dispatch(hideloading());
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  );
}

export default Profile;