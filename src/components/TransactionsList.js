import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsList = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dateFilter, setDateFilter] = useState('all');
    const [profitFilter, setProfitFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const now = new Date();
        let filtered = transactions;

        switch (dateFilter) {
            case 'lastMonth':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                filtered = filtered.filter(t => new Date(t.date) >= lastMonth);
                break;
            case 'last3Months':
                const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                filtered = filtered.filter(t => new Date(t.date) >= last3Months);
                break;
            case 'last6Months':
                const last6Months = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                filtered = filtered.filter(t => new Date(t.date) >= last6Months);
                break;
            case 'lastYear':
                const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                filtered = filtered.filter(t => new Date(t.date) >= lastYear);
                break;
            default:
                break;
        }

        setFilteredTransactions(filtered);
    }, [dateFilter, transactions]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    let filteredProfitTransactions = [...filteredTransactions];

    switch (profitFilter) {
        // Since profitFilter conditions are the same as dateFilter, you might want to refactor this to avoid repetition.
        case 'lastMonth':
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            filteredProfitTransactions = filteredProfitTransactions.filter(t => new Date(t.date) >= lastMonth);
            break;
        case 'last3Months':
            const last3Months = new Date();
            last3Months.setMonth(last3Months.getMonth() - 3);
            filteredProfitTransactions = filteredProfitTransactions.filter(t => new Date(t.date) >= last3Months);
            break;
        case 'last6Months':
            const last6Months = new Date();
            last6Months.setMonth(last6Months.getMonth() - 6);
            filteredProfitTransactions = filteredProfitTransactions.filter(t => new Date(t.date) >= last6Months);
            break;
        case 'lastYear':
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            filteredProfitTransactions = filteredProfitTransactions.filter(t => new Date(t.date) >= lastYear);
            break;
        default:
            break;
    }

    const totalProfitEur = filteredProfitTransactions.reduce((acc, transaction) => {
        return transaction.profit ? acc + transaction.profit : acc;
    }, 0);

    const totalProfitKmConverted = totalProfitEur * 1.95;

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredTransactions.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Završene transakcije</h2>
            <div>
                <label>Filtriraj transakcije po datumu:</label>
                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                    <option value="all">Sve</option>
                    <option value="lastMonth">Prošli mjesec</option>
                    <option value="last3Months">Zadnja 3 mjeseca</option>
                    <option value="last6Months">Zadnjih 6 mjeseci</option>
                    <option value="lastYear">Godinu dana</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>USDT</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((transaction, index) => {
                        const profitEur = transaction.profit ? transaction.profit.toFixed(2) : '0.00';
                        return (
                            <tr key={index}>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td>{transaction.amount}</td>
                                <td>{profitEur}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div style={{ margin: '20px 0' }}>
                {pageNumbers.map(number => (
                    <span key={number} style={{ margin: '0 10px', cursor: 'pointer' }} onClick={() => setCurrentPage(number)}>
                        {number}
                    </span>
                ))}
            </div>
            <div>
                <h3>Profit filter:</h3>
                <select value={profitFilter} onChange={e => setProfitFilter(e.target.value)}>
                    <option value="all">Sve</option>
                    <option value="lastMonth">Prošli mjesec</option>
                    <option value="last3Months">Zadnja 3 mjeseca</option>
                    <option value="last6Months">Zadnjih 6 mjeseci</option>
                    <option value="lastYear">Godinu dana</option>
                </select>
            </div>
            <div style={{ marginTop: '20px' }}>
                <p>
                    Ukupni profit (EUR): <strong>{totalProfitEur.toFixed(2)} EUR</strong>
                </p>
                <p>
                    Ukupni profit (KM): <strong>{totalProfitKmConverted.toFixed(2)} KM</strong>
                </p>
            </div>
        </div>
    );
};

export default TransactionsList;

