import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import MeditationTimer from './components/MeditationTimer/MeditationTimer';
import '@fontsource/nunito';
import Progress from './components/Progress/Progress';

const App = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/meditation" element={<MeditationTimer />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/" element={<Login />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
