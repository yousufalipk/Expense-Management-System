import React, {useState} from 'react';
import styles from './LoginForm.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const LoginForm = (props) => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e)=>{
        e.preventDefault(); 

        //Login logic

        try{
            const response = await axios.post(`${apiUrl}/login-user`,{
                email: formData.email,
                password: formData.password
            }, 
            {
                withCredentials: true 
            });
            console.log("Response", response);
    
            if(response.data.status === "success"){
                localStorage.setItem('userId', response.data.user._id);
                localStorage.setItem('username', response.data.user.username);
                toast.success('Log In Successful!')
                props.setToggle(true);
                props.setAuth(true);
                navigate('/admin')
            }
            else{
                toast.error(response.data.message);
            }
        }catch(error){
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
                <h3 className={styles.heading}>Login Form</h3>
                <form onSubmit={handleLogin} className={styles.box}>
                    <input 
                        type='text' 
                        id='email' 
                        name='email' 
                        placeholder='Email' 
                        onChange={handleChange}
                        value={formData.email}
                    />

                    <input 
                        type='password' 
                        id='password' 
                        name='password' 
                        placeholder='Password' 
                        onChange={handleChange}
                        value={formData.password}
                    />
                    
                    <button className={styles.btn}
                        type='submit'
                    > 
                        Sign In
                    </button>
                </form>
            </div>
        </>
    )
}

export default LoginForm
