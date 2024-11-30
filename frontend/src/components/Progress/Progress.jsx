import React, { useState, useEffect } from 'react';
import { Clock, Brain, Calendar, Trophy, ArrowUp, Target } from 'lucide-react';
import styles from './Progress.module.css';
import Navbar from '../Navbar/Navbar';

const Progress = () => {
    const [stats, setStats] = useState({
        totalFocusTime: 0,
        totalMeditationTime: 0,
        currentStreak: 0,
        completedSessions: 0,
        weeklyProgress: 0,
        monthlyGoal: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProgress();
        // Fetch progress every minute to keep it updated
        const interval = setInterval(fetchProgress, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await fetch('http://localhost:5000/wellness/progress', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch progress data');
            }
            
            const data = await response.json();
            
            // Convert seconds to hours and minutes for display
            const focusHours = Math.floor(data.totalFocusTime / 3600);
            const focusMinutes = Math.floor((data.totalFocusTime % 3600) / 60);
            const meditationHours = Math.floor(data.totalMeditationTime / 3600);
            const meditationMinutes = Math.floor((data.totalMeditationTime % 3600) / 60);
            
            setStats({
                totalFocusTime: `${focusHours}h ${focusMinutes}m`,
                totalMeditationTime: `${meditationHours}h ${meditationMinutes}m`,
                currentStreak: data.currentStreak,
                completedSessions: data.completedSessions,
                weeklyProgress: data.weeklyProgress,
                monthlyGoal: `${data.monthlyGoal}%`
            });
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.loading}>Loading progress...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <Navbar />
                <div className={styles.errorContainer}>
                    <div className={styles.error}>Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <main className={styles.mainContent}>
                <div className={styles.headerSection}>
                    <h1>Your Progress</h1>
                    <p>Track your productivity journey</p>
                </div>

                <div className={styles.statsGrid}>
                    {/* Total Focus Time */}
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>Total Focus Time</h3>
                            <p>{stats.totalFocusTime}</p>
                        </div>
                    </div>

                    {/* Total Meditation Time */}
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Brain size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>Meditation Time</h3>
                            <p>{stats.totalMeditationTime}</p>
                        </div>
                    </div>

                    {/* Current Streak */}
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Trophy size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>Current Streak</h3>
                            <p>{stats.currentStreak} days</p>
                        </div>
                    </div>

                    {/* Completed Sessions */}
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Calendar size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>Completed Sessions</h3>
                            <p>{stats.completedSessions}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.detailedStats}>
                    {/* Weekly Progress */}
                    <div className={styles.progressCard}>
                        <h3>
                            <ArrowUp size={20} />
                            Weekly Progress
                        </h3>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${Math.min(Math.max(stats.weeklyProgress, 0), 100)}%` }}
                            />
                        </div>
                        <p>{stats.weeklyProgress}% increase from last week</p>
                    </div>

                    {/* Monthly Goal */}
                    <div className={styles.progressCard}>
                        <h3>
                            <Target size={20} />
                            Monthly Goal
                        </h3>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: stats.monthlyGoal }}
                            />
                        </div>
                        <p>{stats.monthlyGoal} completed</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Progress;