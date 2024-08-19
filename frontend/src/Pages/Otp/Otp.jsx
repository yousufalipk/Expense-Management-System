import React, { useState } from 'react';
import styles from './Otp.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Otp = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const email = localStorage.getItem('email');

  const [formData, setFormData] = useState({
    otp: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    //Verify Otp Logic

    try {
      const response = await axios.post(`${apiUrl}/verify-otp`, {
        otp: formData.otp,
        email: email
      });

      if (response.data.status === "success") {
        setTimeout(() => {
          toast.success("Account Verified!");
        }, 2000);
        navigate('/auth')
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Internal Server Error!');
    }

    //Clears Form Data
    setFormData({
      email: '',
      password: ''
    });
  }

  const handleResend = async () => {
    try {
      const response = await axios.post(`${apiUrl}/generate-otp`, {
        email: email
      });

      if (response.data.status === "success") {
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Internal Server Error!');
    }

    //Clears Form Data
    setFormData({
      email: '',
      password: ''
    });
  }

  return (
    <>
      <div className={styles.container}>
        <p className={styles.note}>Enter 6 digit's otp sent to email!</p>
        <form onSubmit={handleSubmit} className={styles.box}>
          <input
            type='text'
            id='otp'
            name='otp'
            autoComplete="otp"
            placeholder='123...'
            onChange={handleChange}
            value={formData.otp}
          />

          <button className={styles.btn}
            type='submit'
          >
            Submit
          </button>
        </form>
        <div className={styles.resend}>
          <button
            onClick={handleResend}
            className={styles.resendBtn}
          >
            Resend Otp?
          </button>
        </div>
      </div>
    </>
  )
}

export default Otp;
