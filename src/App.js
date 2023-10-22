import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from 'react-router-dom';
import './App.css';

// Uvoz komponenata
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import Funds from './components/Funds';
import Login from './components/Login';  // Dodajemo Login komponentu koju ćete stvoriti u src/components

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <Router>
        <div className="App">
          <Login onLogin={() => setLoggedIn(true)} />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">

        {/* Navigacija */}
        <nav>
          <ul>
            <li><Link to="/escrow">Escrow</Link></li>
            <li><Link to="/transactions">Transakcije</Link></li>
            <li><Link to="/funds">Sredstva</Link></li>
          </ul>
        </nav>

        <Routes>
            <Route path="/transactions" element={<TransactionsList />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/escrow" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
        </Routes>

        {/* Ovdje možete dodati eventualni Footer ako ga planirate koristiti. */}

      </div>
    </Router>
  );
}

export default App;

