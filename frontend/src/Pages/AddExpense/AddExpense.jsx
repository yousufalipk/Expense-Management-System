import styles from './AddExpense.module.css';
import React from 'react';
import { useNavigate} from 'react-router-dom';

//Importing Form Component
import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';

const AddExpense = ({ addExpense }) => {
    const navigate = useNavigate();

    const handleBack = () => {
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
                <ExpenseForm addExpense={addExpense}/>
            </div>
        </>
    )
}

export default AddExpense;