import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useAutoLogin(props) {
  const navigate = useNavigate();

  useEffect(() => {
    // IIFE
    const autoLoginApiCall = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/refresh`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          localStorage.setItem('userId', response.data.user._id);
          localStorage.setItem('username', response.data.user.username);
          props.setToggle(true);
          props.setAuth(true);
          navigate('/admin')
        }
      } catch (error) {
        //
      }
    }

    autoLoginApiCall();


    }, []);
}

export default useAutoLogin;