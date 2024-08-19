import styles from './Auth.module.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';


//Importing Login & Register Froms
import LoginPage from '../../Pages/Login/Login';
import RegisterPage from '../../Pages/Register/Register';
import OtpPage from '../../Pages/Otp/Otp';
import NavBar from '../../components/NavBar/NavBar';


const AuthLayout = ({ toggle, setToggle, setAuth}) => {
    return (
        <>   
            <div className={styles.container}>
                {/* NavBar */}
                <NavBar toggle={toggle}/> 
                <div className={styles.content}> 
                    {/* Sub Routes  */}
                    <Routes>
                        <Route path='*' element={<LoginPage setToggle={setToggle} setAuth={setAuth}/>} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/otp' element={<OtpPage />} />
                    </Routes>
                </div>

                {/* Footer  */}
                <div className={styles.footer}>
                    <h4 className={styles.heading}>
                        <hr className={styles.sept} />
                        © 2024 ameeryousuf.com - All rights reserved
                    </h4>
                </div>
            </div>
        </>
    );
}

export default AuthLayout;