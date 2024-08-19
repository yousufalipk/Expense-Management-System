import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './RegisterForm.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RegisterFrom = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            fname: Yup.string().required('First Name is required'),
            lname: Yup.string().required('Last Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a @gmail.com')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post(`${apiUrl}/create-user`, {
                    fname: values.fname,
                    lname: values.lname,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                }, {
                    withCredentials: true
                });

                if (response.data.status === "success") {
                    try {
                        localStorage.setItem('email', values.email);
                        navigate('/otp');
                        setTimeout(() => {
                            toast.success("Otp Sent!");
                        }, 2000);
                    } catch (error) {
                        console.log(error);
                        toast.error('Internal Server Error!');
                    }
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Internal Server Error");
                console.log("Error");
                alert("Registration Failed!");
            }
            resetForm(); // Clear form data
        }
    });

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Registration Form</h3>
            <form onSubmit={formik.handleSubmit} className={styles.box}>
                <input
                    type='text'
                    id='fname'
                    name='fname'
                    placeholder='First Name'
                    autoComplete="fname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fname}
                />
                {formik.touched.fname && formik.errors.fname ? (
                    <div className={styles.error}>{formik.errors.fname}</div>
                ) : null}

                <input
                    type='text'
                    id='lname'
                    name='lname'
                    placeholder='Last Name'
                    autoComplete="lname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lname}
                />
                {formik.touched.lname && formik.errors.lname ? (
                    <div className={styles.error}>{formik.errors.lname}</div>
                ) : null}

                <input
                    type='text'
                    id='email'
                    name='email'
                    placeholder='Email'
                    autoComplete="email"
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

                <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    placeholder='Confirm Password'
                    autoComplete="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <div className={styles.error}>{formik.errors.confirmPassword}</div>
                ) : null}

                <button className={styles.btn} type='submit'>
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default RegisterFrom;
