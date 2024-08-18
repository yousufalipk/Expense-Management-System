import React, {useState} from 'react';
import styles from './RegisterForm.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RegisterFrom = (props) => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
      fname: '',
      lname: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRegister = async (e)=>{
        e.preventDefault(); 
        console.log("API" , apiUrl);
        //Registration logic
        try{
            const response = await axios.post(`${apiUrl}/create-user`, {
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            }, {
                withCredentials: true
            });
            
            if(response.data.status === 'success'){
                try{
                    const response = await axios.post(`${apiUrl}/login-user`,{
                        email: formData.email,
                        password: formData.password
                    });
                    console.log("Response", response);
            
                    if(response.data.status === "success"){
                        toast.success('Account Created Successfully!')
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
            }
            else{
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error("Internal Server Error");
            console.log("Error");
            alert("Registration Failed!")
        }
        //Clears Form Data
        setFormData({
            fname: '',
            lname: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    return (
        <> 
            <div className={styles.container}>
                <h3 className={styles.heading}>Registration Form</h3>
                <form onSubmit={handleRegister} className={styles.box}>
                    <input 
                        type='text' 
                        id='fname' 
                        name='fname' 
                        placeholder='First Name' 
                        onChange={handleChange}
                        value={formData.fname}
                    />

                    <input 
                        type='text' 
                        id='lname' 
                        name='lname' 
                        placeholder='Last Name' 
                        onChange={handleChange}
                        value={formData.lname}
                    />

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

                    <input 
                        type='password' 
                        id='confirmPassword' 
                        name='confirmPassword' 
                        placeholder='Confirm Password' 
                        onChange={handleChange}
                        value={formData.confirmPassword}
                    />
                    
                    <button className={styles.btn}
                        type='submit'
                    > 
                        Create Account
                    </button>
                </form>
            </div>
        </>
    )
}

export default RegisterFrom;
