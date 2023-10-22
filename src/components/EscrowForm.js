import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';  // Ažurirajte putanju prema potrebi

const EscrowForm = () => {
    const [action, setAction] = useState('sell');
    const [usdtAmount, setUsdtAmount] = useState('');
    const [feePercentage, setFeePercentage] = useState(0);
    const [conversionRates, setConversionRates] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchConversionRate();
    }, []);

    const fetchConversionRate = async () => {
        try {
            const response = await axios.get('http://api.exchangeratesapi.io/latest?base=EUR&symbols=USD,BAM&access_key=04ac7dfc0cd8e57c4139fb2b98febe4d');
            setConversionRates(response.data.rates);
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
        }
    };

    const calculateAdjustedAmount = () => {
        if (!usdtAmount || !conversionRates.USD || !conversionRates.BAM) return null;

        const fee = usdtAmount * (feePercentage / 100);
        const adjustedUsdt = action === 'sell' ? usdtAmount - fee : usdtAmount + fee;
        const adjustedUsd = adjustedUsdt;

        const adjustedEur = adjustedUsd / conversionRates.USD;
        const adjustedKm = adjustedEur * conversionRates.BAM;

        return {
            usd: adjustedUsd,
            eur: adjustedEur,
            km: adjustedKm,
        };
    };

    const calculateProfit = (adjustedAmount) => {
        if (!adjustedAmount) return null;

        const profitUsd = action === 'sell' ? usdtAmount - adjustedAmount.usd : adjustedAmount.usd - usdtAmount;
        return profitUsd / conversionRates.USD;
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCompleted = async () => {
        try {
            const adjustedAmount = calculateAdjustedAmount();
            const profit = calculateProfit(adjustedAmount);

            await axios.post('http://localhost:3000/funds/addProfit', {
                profit,
                currency: "EUR"
            });

            await axios.post('http://localhost:3000/api/transactions', {
                amount: usdtAmount,
                fee: usdtAmount * (feePercentage / 100),
                adjustedAmount: {
                    usd: adjustedAmount.usd,
                    eur: adjustedAmount.eur,
                    km: adjustedAmount.km
                },
                profit: profit,
                currency: "EUR",
                type: action === 'sell' ? 'Sell' : 'Buy',
                date: new Date()
            });

            openModal();
        } catch (error) {
            console.error("Error adding profit and recording transaction:", error);
        }
    };

    const adjustedAmountDisplay = calculateAdjustedAmount();
    const profitDisplay = calculateProfit(adjustedAmountDisplay);

    return (
        <div className="escrow-form">
            <h2>Escrow Kalkulator</h2>

            <div className="row">
                <div className="escrow-input-group">
                    <label>Podesi:</label>
                    <select value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="sell">Prodaj</option>
                        <option value="buy">Kupi</option>
                    </select>
                </div>

                <div className="escrow-input-group">
                    <label>USDT:</label>
                    <input type="number" value={usdtAmount} onChange={(e) => setUsdtAmount(parseFloat(e.target.value))} />
                </div>

                <div className="escrow-input-group">
                    <label>Fee:</label>
                    <select value={feePercentage} onChange={(e) => setFeePercentage(parseFloat(e.target.value))}>
                        <option value={0}>0%</option>
                        <option value={1}>1%</option>
                        <option value={2}>2%</option>
                        <option value={3}>3%</option>
                        <option value={4}>4%</option>
                        <option value={5}>5%</option>
                    </select>
                </div>
            </div>

            {adjustedAmountDisplay && (
                <div>
                    <h3>Kalkulacija:</h3>
                    <p>{`Isplatiti ${action === 'sell' ? '' : 'Naplatiti'} in USD: ${adjustedAmountDisplay.usd.toFixed(2)}`}</p>
                    <p>{`Isplatiti ${action === 'sell' ? '' : 'Naplatiti'} in EUR: ${adjustedAmountDisplay.eur.toFixed(2)}`}</p>
                    <p>{`Isplatiti ${action === 'sell' ? '' : 'Naplatiti'} in KM: ${adjustedAmountDisplay.km.toFixed(2)}`}</p>
                    <p>{`My profit in EUR: ${profitDisplay.toFixed(2)}`}</p>
                    <button onClick={handleCompleted}>Potvrdi!</button>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h3>Završeno - Potvrđeno</h3>
                <p>Profit dodan na glavna sredstva!</p>
            </Modal>
        </div>
    );
};

export default EscrowForm;
