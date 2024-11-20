import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storeUsername = localStorage.getItem('userName');

        if (!storeUsername) {
            navigate('/login');
            return;
        }

        setUsername(storeUsername);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    };


    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1>Welcome, {username}</h1>
            </header>
        </div>
    );
};

export default Dashboard;