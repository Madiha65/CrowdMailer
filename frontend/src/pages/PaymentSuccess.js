import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { plan, amount, paymentMethod } = location.state || {
        plan: "Starter Plan",
        amount: "₹499.00",
        paymentMethod: "Credit Card"
    };

    // Generate random transaction ID for demo
    const transactionId = "#TRX-" + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="payment-success-wrapper">
            <div className="payment-success-card">
                <div className="success-icon-container">
                    <svg viewBox="0 0 24 24" className="success-icon">
                        <path fill="none" stroke="currentColor" strokeWidth="2" d="M20 6L9 17l-5-5" />
                    </svg>
                </div>

                <h2>Payment Successful!</h2>
                <p className="success-message">
                    Thank you for your purchase. Your subscription to the <br />
                    <strong>{plan}</strong> is now active and ready to use.
                </p>

                <div className="transaction-details">
                    <div className="detail-row">
                        <span className="detail-label">Transaction ID</span>
                        <span className="detail-value">{transactionId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Date</span>
                        <span className="detail-value">{currentDate}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Payment Method</span>
                        <span className="detail-value">{paymentMethod} ending 4242</span>
                    </div>
                    <div className="detail-row total">
                        <span className="detail-label">Amount Paid</span>
                        <span className="detail-value amount">{amount}</span>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="primary-btn" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </button>
                    <button className="secondary-btn">
                        <span className="download-icon">↓</span> Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
