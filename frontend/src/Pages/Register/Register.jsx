import React from 'react';
import styles from './Register.module.css';

import RegisterForm from '../../components/Forms/RegisterForm/RegisterForm';

const Register = () => {
  return (
    <>
        <div className={styles.container}>
            <RegisterForm />
        </div>
    </>
  )
}

export default Register;
