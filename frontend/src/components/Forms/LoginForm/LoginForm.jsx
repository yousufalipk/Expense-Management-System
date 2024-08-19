import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './LoginForm.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginForm = (props) => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post(`${apiUrl}/login-user`, {
                    email: values.email,
                    password: values.password
                }, {
                    withCredentials: true
                });


                if (response.data.status === "success") {
                    localStorage.setItem('userId', response.data.user._id);
                    localStorage.setItem('username', response.data.user.username);
                    toast.success('Log In Successful!');
                    props.setToggle(true);
                    props.setAuth(true);
                    navigate('/admin');
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error('Internal Server Error!');
            }

            resetForm(); // Clear form data
        }
    });

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Login Form</h3>
            <form onSubmit={formik.handleSubmit} className={styles.box}>
                <input
                    type='text'
                    id='email'
                    name='email'
                    autoComplete="email"
                    placeholder='Email'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className={styles.error}>{formik.errors.email}</div>
                ) : null}

                <input
                    type='password'
                    id='password'
                    name='password'
                    placeholder='Password'
                    autoComplete="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className={styles.error}>{formik.errors.password}</div>
                ) : null}

                <button className={styles.btn} type='submit'>
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
