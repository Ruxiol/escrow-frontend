import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

function Funds() {
    const [funds, setFunds] = useState({ EUR: 0, KM: 0, USDT: 0 });
    const [amount, setAmount] = useState({ EUR: 0, KM: 0, USDT: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAmount(prevState => ({ ...prevState, [name]: parseFloat(value) }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/funds/add', amount);
            setFunds(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error adding funds:", error);
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/funds/withdraw', amount);
            setFunds(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error withdrawing funds:", error);
        }
    }

    useEffect(() => {
        const fetchFunds = async () => {
            try {
                const response = await axios.get('http://localhost:3000/funds');
                setFunds(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching funds:", error);
                setIsLoading(false);
            }
        }
        fetchFunds();
    }, []);

    return (
        <div>
            <h2>Sredstva</h2>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="funds-container">
                    <div className="funds-balance">
                        <div className="funds-item">
                            <img src="/euro-logo.png" alt="Euro logo" />
                            <span>EUR: {funds.EUR.toFixed(2)}</span>
                        </div>
                        <div className="funds-item">
                            <img src="/km-logo.png" alt="KM logo" />
                            <span>KM: {funds.KM.toFixed(2)}</span>
                        </div>
                        <div className="funds-item">
                            <img src="/usdt-logo.png" alt="USDT logo" />
                            <span>USDT: {funds.USDT.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    EUR: <input type="number" name="EUR" value={isNaN(amount.EUR) ? '' : amount.EUR.toString()} onChange={handleInputChange} />
                </label>
                <label>
                    KM: <input type="number" name="KM" value={isNaN(amount.KM) ? '' : amount.KM.toString()} onChange={handleInputChange} />
                </label>
                <label>
                    USDT: <input type="number" name="USDT" value={isNaN(amount.USDT) ? '' : amount.USDT.toString()} onChange={handleInputChange} />
                </label>
                <button type="submit">Dodaj</button>
                <button type="button" onClick={handleWithdraw}>Oduzmi</button>
            </form>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3>Success!</h3>
                <p>Sredstva su uspješno ažurirana!</p>
                <button onClick={() => setIsModalOpen(false)}>Zatvori</button>
            </Modal>
        </div>
    );
}

export default Funds;

