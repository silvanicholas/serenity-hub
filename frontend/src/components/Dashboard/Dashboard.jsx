import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('userName');
        if (!storedUsername) {
            navigate('/login');
            return;
        }
        setUsername(storedUsername);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <div className={styles.pageContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
                    <h1>Serenity Hub</h1>
                </div>
                <div className={styles.navRight}>
                    <span className={styles.username}>{username}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </nav>

            <main className={styles.mainContent}>
                <div className={styles.welcomeSection}>
                    <h2>Welcome back, {username}</h2>
                    <p>What would you like to focus on today?</p>
                </div>

                <div className={styles.cardGrid}>
                    <Link to="/pomodoro" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <i className="fas fa-clock"></i>
                        </div>
                        <h3>Pomodoro Timer</h3>
                        <p>Focus with timed work sessions</p>
                    </Link>

                    <Link to="/meditation" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <i className="fas fa-om"></i>
                        </div>
                        <h3>Meditation</h3>
                        <p>Clear your mind with guided sessions</p>
                    </Link>
                    <Link to="/stats" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3>Progress</h3>
                        <p>Track your productivity journey</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;