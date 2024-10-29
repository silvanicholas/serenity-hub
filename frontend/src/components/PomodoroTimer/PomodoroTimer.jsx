import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PomodoroTimer.module.css';

function PomodoroTimer() {
  const navigate = useNavigate();
  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    let timer = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(workTime);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Back
        </button>
        <h1 className={styles.heading}>{isWorkSession ? 'Work Session' : 'Break Session'}</h1>
        <div className={styles.timer}>{formatTime(timeLeft)}</div>
        <div className={styles.buttons}>
          <button onClick={handleStartPause} className={styles.button}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset} className={styles.button}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;