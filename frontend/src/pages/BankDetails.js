import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const BankDetails = () => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const plan = params.get("plan") || "starter";

  const planDetails = {
    free: {
      name: "Free Plan",
      price: "₹0",
      features: [
        "Send up to 5 campaigns",
        "Basic templates",
        "Subscriber management",
        "Email support",
      ],
    },
    starter: {
      name: "Starter Plan",
      price: "₹499",
      features: [
        "500 campaigns per month",
        "CSV Import included",
        "Advanced email scheduling",
        "Standard support",
      ],
    },
    pro: {
      name: "Pro Analytics",
      price: "₹1,999",
      features: [
        "Unlimited emails",
        "Real-time analytics",
        "Audience segmentation",
        "Priority support",
      ],
    },
  };

  const selectedPlan = planDetails[plan] || planDetails.starter;

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=/bank-details&plan=${plan}`);
      return;
    }
    setSubmitting(true);
    try {
      // TODO: replace with a real gateway (Razorpay/Stripe) and activate the
      // plan from the server only after the payment is verified.
      await api.post("/subscription/activate", { plan });
      navigate("/payment-success", {
        state: {
          plan: selectedPlan.name,
          amount: selectedPlan.price,
          paymentMethod: paymentMethod === "card" ? "Credit Card" : "PayPal",
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Could not activate plan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="subscription-wrapper">
      <div className="subscription-container">

        {/* Left Column - Billing Info / Summary (reversed in new design, actually screenshot puts summary on RIGHT or LEFT? 
           Screenshot 1: "Complete your subscription" header. 
           Left col: "Billing Information" form. 
           Right col: "Starter Plan" summary.
           Wait, looking at screenshot 1 again.
           Left side: "Billing Information" (First Name, Last Name, Email, Address, Payment Method).
           Right side: "Starter Plan" card with price and checks.
           
           Let's implement it exactly like that.
        */}

        <div className="billing-section">
          <h2>Complete your subscription</h2>
          <p className="sub-heading">You're just one step away from premium features.</p>

          <div className="billing-form-container">
            <h3>Billing Information</h3>
            <form onSubmit={handleSubmit} id="billing-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue={user?.name?.split(" ")[0] || ""} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue={user?.name?.split(" ").slice(1).join(" ") || ""} required />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue={user?.email || ""} required />
              </div>

              <div className="form-group">
                <label>Billing Address</label>
                <input type="text" placeholder="123 Market Street, Suite 400" required />
              </div>

              <h3>Payment Method</h3>
              <div className="payment-methods">
                <div
                  className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="radio-circle">
                    {paymentMethod === 'card' && <div className="inner-circle"></div>}
                  </div>
                  <span>Credit or Debit Card</span>
                  <div className="card-icon">💳</div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiration Date</label>
                        <input type="text" placeholder="MM / YY" required />
                      </div>
                      <div className="form-group">
                        <label>CVC</label>
                        <input type="text" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="radio-circle">
                    {paymentMethod === 'paypal' && <div className="inner-circle"></div>}
                  </div>
                  <span>PayPal</span>
                  <div className="card-icon">🗂️</div>
                </div>

                {paymentMethod === 'paypal' && (
                  <div className="paypal-notice">
                    <span className="paypal-icon-large">🔗</span>
                    <h4>Redirect to PayPal</h4>
                    <p>
                      You will be redirected to PayPal to complete your purchase securely. No payment details are stored on our servers.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="plan-summary-section">
          <div className="plan-summary-card">
            <div className="plan-header">
              <div>
                <h3>{selectedPlan.name}</h3>
                <span className="billing-cycle">Monthly billing</span>
              </div>
              <div className="plan-price">
                <span className="amount">{selectedPlan.price}</span>
                <span className="period">/month</span>
              </div>
            </div>

            <ul className="plan-features">
              {selectedPlan.features.map((feature, index) => (
                <li key={index}>✔ {feature}</li>
              ))}
            </ul>

            <div className="total-row">
              <span>Total due today</span>
              <span className="total-amount">{selectedPlan.price}.00</span>
            </div>

            <button type="submit" form="billing-form" className="confirm-btn" disabled={submitting}>
              {submitting ? 'Activating...' : paymentMethod === 'paypal' ? 'Proceed to PayPal' : `Confirm & Pay ${selectedPlan.price}`}
            </button>

            <p className="security-note">🔒 Payments are secure and encrypted</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BankDetails;
