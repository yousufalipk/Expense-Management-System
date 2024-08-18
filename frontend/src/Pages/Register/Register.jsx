import React from 'react';
import styles from './Register.module.css';

import RegisterForm from '../../components/Forms/RegisterForm/RegisterForm';

const Register = (props) => {
  return (
    <>
        <div className={styles.container}>
            <RegisterForm setToggle={props.setToggle} setAuth={props.setAuth}/>
        </div>
    </>
  )
}

export default Register;
