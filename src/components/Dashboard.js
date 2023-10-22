import React from 'react';
import EscrowForm from './EscrowForm';
import Funds from './Funds';
import TransactionsList from './TransactionsList';

const Dashboard = () => {
  return (
    <div>
      <div className="module">
        <EscrowForm />
      </div>

      <div className="module">
        <Funds />
      </div>

      <div className="module">
        <TransactionsList />
      </div>
    </div>
  );
};

export default Dashboard;

