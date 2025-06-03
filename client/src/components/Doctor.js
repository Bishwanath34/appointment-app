import moment from 'moment';
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Doctor({ doctor, isAdmin }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAdmin) {
      navigate(`/book-appointment/${doctor._id}`);
    }
  };

  return (
    <div
      className='card ps-3 pt-3 pb-3'
      onClick={handleClick}
      style={{ cursor: isAdmin ? 'default' : 'pointer' }}
    >
      <h1 className='card-title'>{doctor.firstName} {doctor.lastName}</h1>
      <hr />
      <p><b>Phone Number:</b> {doctor.phoneNumber}</p>
      <p><b>Address:</b> {doctor.address}</p>
      <p><b>Fee per Visit:</b> {doctor.feePerConsultation}</p>
      <p>
        <b>Timings: </b>
        {moment(doctor.timings[0], 'HH:mm').format('hh:mm A')}-{moment(doctor.timings[1], 'HH:mm').format('hh:mm A')}
      </p>
    </div>
  )
}

export default Doctor;
