import React from 'react';
import styles from './Login.module.css';

import LoginFrom from '../../components/Forms/LoginForm/LoginForm';

const Login = (props) => {
  return (
    <>
        <div className={styles.container}>
            <LoginFrom  setToggle={props.setToggle} setAuth={props.setAuth}/>
        </div>
    </>
  )
}

export default Login;
