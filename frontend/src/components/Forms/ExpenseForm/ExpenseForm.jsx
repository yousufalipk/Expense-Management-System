import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './ExpenseForm.module.css';

const ExpenseForm = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const apiUrl = process.env.REACT_APP_API_URL;

    const formik = useFormik({
        initialValues: {
            date: '',
            category: 'food',
            description: '',
            amount: ''
        },
        validationSchema: Yup.object({
            date: Yup.date().required('Date is required'),
            category: Yup.string().required('Category is required'),
            description: Yup.string()
                .max(100, 'Description must be 100 characters or less')
                .required('Description is required'),
            amount: Yup.number()
                .typeError('Amount must be a number')
                .positive('Amount must be a positive number')
                .required('Amount is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post(`${apiUrl}/expense/add-expense`, {
                    date: values.date,
                    category: values.category,
                    description: values.description,
                    amount: values.amount,
                    userId: userId,
                }, {
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                } else {
                    console.log("Response", response.data);
                    toast.error(response.data.message);
                }

                resetForm(); // Clear form data
            } catch (error) {
                toast.error("Internal Server Error");
                console.log("Error");
                alert("Failed to add expense!");
            }
        }
    });

    return (
        <>
            <div className={styles.heading}>
                <h3>Add New Expense!</h3>
            </div>
            <hr className={styles.seperator}/>
            <div className={styles.container}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={styles.feild}>
                        {/* Date */}
                        <label>Date </label><br/>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date}
                        />
                        {formik.touched.date && formik.errors.date ? (
                            <div className={styles.error}>{formik.errors.date}</div>
                        ) : null}
                    </div>

                    <div className={styles.feild}>
                        {/* Category */}
                        <label>Category </label><br/>
                        <select
                            id="category"
                            name="category"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                        >
                            <option value="food">Food</option>
                            <option value="travel">Travel</option>
                            <option value="utilities">Utilities</option>
                            <option value="entertainment">Entertainment</option>
                        </select>
                        {formik.touched.category && formik.errors.category ? (
                            <div className={styles.error}>{formik.errors.category}</div>
                        ) : null}
                    </div>

                    <div className={styles.feild}>
                        {/* Description */}
                        <label>Description </label><br/>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Type Here..."
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className={styles.error}>{formik.errors.description}</div>
                        ) : null}
                    </div>

                    <div className={styles.feild}>
                        {/* Amount */}
                        <label>Amount </label><br/>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            placeholder="000"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                        />
                        {formik.touched.amount && formik.errors.amount ? (
                            <div className={styles.error}>{formik.errors.amount}</div>
                        ) : null}
                    </div>

                    <div className={styles.button}>
                        <button
                            className={styles.btn}
                            type="submit"
                        >
                            Add Expense
                        </button>
                        <button
                            className={styles.btn}
                            type="reset"
                            style={{ backgroundColor: "#808b8c" }}
                            onClick={formik.handleReset}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ExpenseForm;
