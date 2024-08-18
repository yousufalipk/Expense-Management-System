import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing Layouts
import AuthLayout from './Layout/Auth/Auth';
import AdminLayout from './Layout/Admin/Admin';

// Refresh Token Function
const refreshToken = async () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/refresh`, { withCredentials: true });
    return response;
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const [isAuth, setAuth] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        const response = await refreshToken();
        if (response && response.data.auth) {
          setAuth(true);
          setToggle(true);
        } else {
          setAuth(false);
          setToggle(false);
        }
      } catch (error) {
        setAuth(false);
        setToggle(false);
      }
    };

    refreshAuthToken();
  }, []);

  if (isAuth === null) {
    // Render nothing while authentication is being checked
    return null;
  }

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
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
      </BrowserRouter>
    </>
  );
}

export default App;
