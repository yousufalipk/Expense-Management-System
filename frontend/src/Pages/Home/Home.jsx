import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    //Navigate to Add Expense page
    const handleAddExpense = () => {
        navigate("/add-expense");
    }

    //Navigate to Expenses Table
    const handleViewExpenses = () => {
        navigate("/view-expenses");
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.heading}>
                    Welcome! <strong><em> {username}</em></strong>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.btn}
                        onClick={handleAddExpense}
                    >
                        Add Expense
                    </button>
                    <button className={styles.btn}
                        onClick={handleViewExpenses}
                    >
                        View Expenses
                    </button>
                </div>
            </div>
        </>
    )
}

export default Home
