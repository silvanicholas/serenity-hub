import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from the Express backend (via the proxy)
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
