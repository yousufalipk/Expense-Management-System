import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing Layouts
import AuthLayout from './Layout/Auth/Auth';
import AdminLayout from './Layout/Admin/Admin';

//Hook 
import UseAutoLogin from './hooks/useAutoLogin';


function App() {
  const [isAuth, setAuth] = useState(null);
  const [toggle, setToggle] = useState(false);

  const loading = UseAutoLogin();

  return loading ? (<></>):(
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
