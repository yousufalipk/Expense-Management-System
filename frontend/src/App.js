import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing Layouts
import AuthLayout from './Layout/Auth/Auth';
import AdminLayout from './Layout/Admin/Admin';

function App() {
  const [isAuth, setAuth] = useState(null);
  const [toggle, setToggle] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        const response = await axios.get(`${apiUrl}}/refresh`, { 
          withCredentials: true 
        });
        
        if (response.data.auth) {
          console.log("Tokens Refreshed!")
          setAuth(true);
          setToggle(true);
        } else {
          setAuth(false);
          setToggle(false);
        }
      } catch (error) {
        setAuth(false);
      }
    };

    refreshAuthToken();
  }, [isAuth, toggle]);


  return (
    <>
      <ToastContainer />
      <Routes>
        {isAuth && toggle ? (
          <>
            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={<AdminLayout toggle={toggle} setToggle={setToggle} setAuth={setAuth} />} />
            <Route path="*" element={<AdminLayout toggle={toggle} setToggle={setToggle} setAuth={setAuth} />} />
          </>
        ) : (
          <>
            {/* Auth Routes */}
            <Route path="/auth/*" element={<AuthLayout setToggle={setToggle} toggle={toggle} setAuth={setAuth} />} />
            <Route path="*" element={<AuthLayout setToggle={setToggle} toggle={toggle} setAuth={setAuth} />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
