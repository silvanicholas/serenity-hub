import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Timer, Brain, BarChart3, Book } from 'lucide-react';
import styles from './Dashboard.module.css';
import Navbar from '../Navbar/Navbar';

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

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <main className={styles.mainContent}>
                <div className={styles.welcomeSection}>
                    <h2>Welcome back, {username}</h2>
                    <p>What would you like to focus on today?</p>
                </div>

                <div className={styles.cardGrid}>
                    <Link to="/pomodoro" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <Timer size={32} />
                        </div>
                        <h3>Pomodoro Timer</h3>
                        <p>Focus with timed work sessions</p>
                    </Link>

                    <Link to="/meditation" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <Brain size={32} />
                        </div>
                        <h3>Meditation</h3>
                        <p>Clear your mind with guided sessions</p>
                    </Link>

                    <Link to="/progress" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <BarChart3 size={32} />
                        </div>
                        <h3>Progress</h3>
                        <p>Track your productivity journey</p>
                    </Link>

                    <Link to="/journal" className={styles.card}>
                        <div className={styles.cardIcon}>
                            <Book size={32} />
                        </div>
                        <h3>Journal</h3>
                        <p>Document your thoughts and reflections</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;