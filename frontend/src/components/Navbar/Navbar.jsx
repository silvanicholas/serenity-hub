import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Timer, Brain, BarChart3, Home, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';
import { handleLogout } from '../../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('userName');

    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <h1>Serenity Hub</h1>
            </div>
            <div className={styles.navCenter}>
                <Link to="/dashboard" className={styles.navLink}>
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link to="/pomodoro" className={styles.navLink}>
                    <Timer size={24} />
                    <span>Pomodoro</span>
                </Link>
                <Link to="/meditation" className={styles.navLink}>
                    <Brain size={24} />
                    <span>Meditate</span>
                </Link>
                <Link to="/progress" className={styles.navLink}>
                    <BarChart3 size={24} />
                    <span>Progress</span>
                </Link>
            </div>
            <div className={styles.navRight}>
                <span className={styles.username}>{username}</span>
                <button onClick={() => handleLogout(navigate)} className={styles.logoutBtn}>
                    <LogOut size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
