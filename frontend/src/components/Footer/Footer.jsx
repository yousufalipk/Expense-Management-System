import styles from './Footer.module.css';
import React from 'react'; 

const Footer = () => {
    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.heading}> 
                © 2024 ameeryousuf.com - All rights reserved
                </h4>
            </div>
        </>
    );
}

export default Footer;