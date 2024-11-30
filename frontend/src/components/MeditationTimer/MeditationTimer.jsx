import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import styles from './MeditationTimer.module.css';

const MeditationTimer = () => {
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const tickLength = 15;
  const numTicks = 60;

  // Cleanup effect for unmounting
  useEffect(() => {
    return () => {
      if (currentSessionId) {
        endSession();
      }
    };
  }, [currentSessionId]);

  // Timer effect
  useEffect(() => {
    let intervalId;
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  const startSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/wellness/meditation/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      console.log('Meditation session started with ID:', data.session_id);
      setCurrentSessionId(data.session_id);
    } catch (error) {
      console.error('Error starting meditation session:', error);
    }
  };

  const endSession = async () => {
    if (!currentSessionId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/wellness/meditation/end/${currentSessionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      console.log('Meditation session ended successfully');
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error ending meditation session:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateTicks = () => {
    const ticks = [];
    const progressRatio = timeLeft / totalSeconds;
    const activeTicks = Math.ceil(numTicks * progressRatio);

    for (let i = 0; i < numTicks; i++) {
      const angle = (i * 360) / numTicks;
      const radian = (angle - 90) * (Math.PI / 180);
      
      const innerX = center + radius * Math.cos(radian);
      const innerY = center + radius * Math.sin(radian);
      const outerX = center + (radius + tickLength) * Math.cos(radian);
      const outerY = center + (radius + tickLength) * Math.sin(radian);

      ticks.push(
        <line
          key={i}
          x1={innerX}
          y1={innerY}
          x2={outerX}
          y2={outerY}
          stroke={i < activeTicks ? "#3B82F6" : "#E5E7EB"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    }
    return ticks;
  };

  const handleStart = async () => {
    if (timeLeft === 0) {
      setTimeLeft(totalSeconds);
    }
    
    // Only start a new session if we don't already have one
    if (!currentSessionId) {
      await startSession();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    // Just pause the timer, don't end the session
    setIsRunning(false);
  };

  const handleReset = async () => {
    if (currentSessionId) {
      await endSession();
    }
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const handleSessionComplete = async () => {
    if (currentSessionId) {
      await endSession();
    }
  };

  const handleSliderChange = async (e) => {
    const minutes = parseInt(e.target.value);
    const seconds = minutes * 60;
    
    // If there's an active session, end it before changing duration
    if (currentSessionId) {
      await endSession();
    }
    
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.timerCard}>
          <h1>Meditation Timer</h1>
          
          <div className={styles.timerContainer}>
            <div className={styles.timerSvgWrapper}>
              <svg width={size} height={size}>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="2"
                />
                {generateTicks()}
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

          <div className={styles.sliderContainer}>
            <div className={styles.sliderLabels}>
              <span>1 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={Math.floor(totalSeconds / 60)}
              onChange={handleSliderChange}
              className={styles.slider}
              disabled={isRunning}
            />
          </div>

          <div className={styles.buttonContainer}>
            {!isRunning ? (
              <button
                onClick={handleStart}
                className={`${styles.button} ${styles.primary}`}
              >
                <Play size={24} />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className={`${styles.button} ${styles.primary}`}
              >
                <Pause size={24} />
              </button>
            )}
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
};

export default MeditationTimer;