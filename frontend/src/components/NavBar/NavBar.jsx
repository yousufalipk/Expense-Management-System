import React, { useState } from 'react';
import styles from './NavBar.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';


const NavBar = ({ toggle, setToggle, setAuth }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/auth');
    }

    const handleRegister = () => {
        navigate('/register');
    }

    const handleLogOut = async () => {
        // LogOut Logic 
        try {
            const response = await axios.get(
                `${apiUrl}/logout-user`,
                {
                    withCredentials: true
                }
            );


            if (response.data.status === "success") {
                toast.success('Log Out Successful!')
            }
            else {
                toast.error(response.data.message);
            }

            navigate('/auth')
            setToggle(false);
            setAuth(false);
        } catch (error) {
            console.log(error);
            toast.error('Internal Server Error!');
        }
    }

    return (
        <>
            <div className={styles.container}>
                {/* NavBar */}
                <div className={styles.navbar}>
                    <div className={styles.logo}>
                        <h3>
                            Expense Management System
                        </h3>
                    </div>
                    <div className={styles.buttons}>
                        {toggle === false ? (
                            <>
                                {/* Login Button */}
                                <button className={styles.btn}
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                                {/* Register Button */}
                                <button className={styles.btn}
                                    onClick={handleRegister}
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Log Out Button */}
                                <button className={styles.btn}
                                    onClick={handleLogOut}
                                >
                                    Log Out
                                </button>
                            </>
                        )}


                    </div>
                </div>
                <hr className={styles.seperator} />
            </div>
        </>
    )
}

export default NavBar;
