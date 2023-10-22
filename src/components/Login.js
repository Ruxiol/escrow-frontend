import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const hardcodedUsername = 'rux';  // Ovdje možete promijeniti hardkodirano korisničko ime
  const hardcodedPassword = 'freak';  // Ovdje možete promijeniti hardkodiranu lozinku

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === hardcodedUsername && password === hardcodedPassword) {
      onLogin();
    } else {
      alert('Pogrešno korisničko ime ili lozinka!');
    }
  };

  return (
    <div>
      <h2>Prijava</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Korisničko ime:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Lozinka:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  );
};

export default Login;

