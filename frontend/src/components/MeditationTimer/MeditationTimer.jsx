import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const MeditationTimer = () => {
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  
  // Constants for the circle
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const tickLength = 15;
  const numTicks = 60;

  useEffect(() => {
    let intervalId;
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

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

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const handleSliderChange = (e) => {
    const minutes = parseInt(e.target.value);
    const seconds = minutes * 60;
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-xl mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Meditation Timer</h1>
          
          <div className="flex justify-center mb-8">
            <div className="relative w-[300px] h-[300px]">
              <svg width={size} height={size}>
                {/* Background circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                
                {/* Tick marks */}
                {generateTicks()}
                
                {/* Center text */}
                <text
                  x={center}
                  y={center}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-mono"
                  fill="#1F2937"
                >
                  {formatTime(timeLeft)}
                </text>
              </svg>
            </div>
          </div>

          <div className="mb-8 px-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Play size={24} />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Pause size={24} />
              </button>
            )}
            <button
              onClick={handleReset}
              className="p-4 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationTimer;