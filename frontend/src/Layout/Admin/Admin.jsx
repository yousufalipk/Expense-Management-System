import React from 'react'; 
import styles from './Admin.module.css';
import { Route, Routes } from 'react-router-dom';

import Home from '../../Pages/Home/Home';

import NavBar from '../../components/NavBar/NavBar';
import AddExpense from '../../Pages/AddExpense/AddExpense';
import ViewExpense from '../../Pages/View Expenses/ViewExpenses';


const Admin = ({toogle, setToggle, setAuth}) => {
    return(
        <>
            <div className={styles.container}> 
                <NavBar toggle={toogle} setToggle={setToggle} setAuth={setAuth}/>
                <div className={styles.content}>
                    {/* Sub Routes  */}
                    <Routes>
                        <Route path='*' element={<Home/>} />
                        <Route path='/add-expense' element={<AddExpense/>} />
                        <Route path='/view-expenses' element={<ViewExpense/>} />
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
    )
};


export default Admin;