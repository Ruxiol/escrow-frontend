import React, { useState } from 'react';
import axios from 'axios';

const Converter = () => {
  const [amount, setAmount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [convertedValue, setConvertedValue] = useState(0);

  const handleConvert = () => {
    // Ovdje će vam trebati logika za konverziju. Na primjer, poziv backend-u koji koristi XE za dohvat omjera.
    axios.post('/api/convert', { amount, percentage })
      .then(response => {
        setConvertedValue(response.data.convertedValue);
      })
      .catch(error => {
        console.error("Error during conversion:", error);
      });
  };

  return (
    <div>
      <h1>Converter</h1>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount in USDT"
      />
      <input
        type="number"
        value={percentage}
        onChange={e => setPercentage(e.target.value)}
        placeholder="Percentage"
      />
      <button onClick={handleConvert}>Convert</button>
      <div>
        Converted Value: {convertedValue}
      </div>
    </div>
  );
}

export default Converter;

