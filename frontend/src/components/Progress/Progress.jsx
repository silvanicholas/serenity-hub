import React, { useState, useEffect } from 'react';
import { Clock, Brain, Calendar, Trophy, ArrowUp, Target } from 'lucide-react';
import styles from './Progress.module.css';
import Navbar from '../Navbar/Navbar';

const Progress = () => {
    // Example data - replace with actual data from your backend/localStorage
    const [stats, setStats] = useState({
        totalFocusTime: '12h 30m',
        totalMeditationTime: '5h 15m',
        currentStreak: 7,
        completedSessions: 42,
        weeklyProgress: 68, // percentage
        monthlyGoal: '80%'
    });

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
                                style={{ width: `${stats.weeklyProgress}%` }}
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
