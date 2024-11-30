import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import styles from './PomodoroTimer.module.css';

function PomodoroTimer() {
  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / (isWorkSession ? workTime : breakTime));

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (currentSessionId) {
        endSession();
      }
    };
  }, [currentSessionId]);

  useEffect(() => {
    let timer = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
      if (isWorkSession) {
        setIsWorkSession(false);
        setTimeLeft(breakTime);
      } else {
        setIsWorkSession(true);
        setTimeLeft(workTime);
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorkSession]);

  const startSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/wellness/focus/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        //credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      console.log('Session started with ID:', data.session_id);
      setCurrentSessionId(data.session_id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    if (!currentSessionId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/wellness/focus/end/${currentSessionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        //credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      console.log('Session ended successfully');
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleStartPause = async () => {
    if (!isRunning && isWorkSession) {
      await startSession();
    }
    setIsRunning(!isRunning);
  };

  const handleSessionComplete = async () => {
    if (isWorkSession && currentSessionId) {
      await endSession();
    }
    setIsRunning(false);
  };

  const handleReset = async () => {
    if (currentSessionId) {
      await endSession();
    }
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(workTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.timerCard}>
          <h1>{isWorkSession ? 'Work Session' : 'Break Time'}</h1>
          <p className={styles.subtitle}>
            {isWorkSession 
              ? 'Stay focused on your task' 
              : 'Take a moment to recharge'}
          </p>

          <div className={styles.timerContainer}>
            <div className={styles.timerSvgWrapper}>
              <svg width={size} height={size}>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="10"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(-90 ${center} ${center})`}
                />
                <text
                  x={center}
                  y={center}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.timerText}
                >
                  {formatTime(timeLeft)}
                </text>
              </svg>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={handleStartPause}
              className={`${styles.button} ${styles.primary}`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={handleReset}
              className={`${styles.button} ${styles.secondary}`}
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PomodoroTimer;