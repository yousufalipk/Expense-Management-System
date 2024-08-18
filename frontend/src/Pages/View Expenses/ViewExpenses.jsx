import styles from './ViewExpenses.module.css';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ViewExpenses = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [expenses, setExpenses] = useState();
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/expense/fetch-expenses`,{
            userId
        });
        console.log("Responses",response.data);

         
        if (response.data.status === 'success') {
            if (response.data.expenses.length > 0) {
              setExpenses(response.data.expenses);
            } else {
                console.log("No Expenses");
            }
        } else {
            console.log("No Expenses")
        }
      } catch (error) {
        console.log("Error", error);
        toast.error("Internal Server Error");
      }
    };

    useEffect(() => {
        fetchData();
      }, []);

    const handleBack = () => {
        console.log(expenses);
        navigate('/');
    }
    
    return (
        <>
            <div className={styles.container}>
                <div className={styles.button}>
                    <button className={styles.btn}
                    onClick={handleBack}
                    > 
                    Back
                    </button>
                </div>
            </div>
            <div className={styles.form}> 
            <div className={styles.heading}>
                <h3>{username} Expenses</h3>
            </div> 
            <table className={styles.table}> 
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses && expenses.length > 0 ? (
                        expenses.map(expense => (
                            <tr key={expense.id}>
                                <td>{expense.date}</td>
                                <td>{expense.category}</td>
                                <td>{expense.description}</td>
                                <td>{expense.amount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" , color: 'red', border: 'none', fontStyle: 'italic' }}>No expenses found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </>
    )
}

export default ViewExpenses;