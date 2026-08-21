import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (planName) => {
    if (!user) {
      navigate(`/login?redirect=/bank-details&plan=${planName}`);
    } else {
      navigate(`/bank-details?plan=${planName}`);
    }
  };
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-grid">

        <div className="price-card">
          <h3>Free Plan</h3>
          <p className="price">₹0 / month</p>
          <ul>
            <li>✔ Send up to 50 emails</li>
            <li>✔ Basic templates</li>
            <li>✔ Subscriber management</li>
            <li>✔ Email support</li>
          </ul>
          <button className="outline-btn" onClick={() => handlePlanClick("free")}>
            Get Free Trial
          </button>
        </div>

        <div className="price-card">
          <h3>Starter Plan</h3>
          <p className="price">₹499 / month</p>
          <ul>
            <li>✔ 500 campaigns</li>
            <li>✔ CSV import</li>
            <li>✔ Email scheduling</li>
            <li>✔ Standard support</li>
          </ul>
          <button onClick={() => handlePlanClick("starter")}>
            Get Starter Plan
          </button>
        </div>

        <div className="price-card">
          <h3>Pro Analytics</h3>
          <p className="price">₹1,999 / month</p>
          <ul>
            <li>✔ Unlimited emails</li>
            <li>✔ Real-time analytics</li>
            <li>✔ Audience segmentation</li>
            <li>✔ Priority support</li>
          </ul>
          <button onClick={() => handlePlanClick("pro")}>
            Get Pro Plan
          </button>
        </div>

      </div>

      <p>Flexible and affordable plans for all your email marketing needs.</p>
    </section>
  );
};

export default PricingPage;
