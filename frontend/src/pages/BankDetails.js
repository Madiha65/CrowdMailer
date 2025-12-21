import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const BankDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");

  const planAmount = {
    free: "₹0",
    starter: "₹499",
    pro: "₹1,999"
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // API call / payment gateway logic here

    navigate(`/dashboard/subscribe?plan=${plan}`);
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-card">

        {/* LEFT SIDE */}
        <div className="payment-left">
          <h3>CrowdMailer</h3>

          <div className="amount-box">
            <span>{planAmount[plan]}</span>
          </div>

          <p className="plan-title">
            {plan?.toUpperCase()} PLAN SUBSCRIPTION
          </p>

          <div className="plan-info">
            <p>✔ Secure payment</p>
            <p>✔ GST included</p>
            <p>✔ Instant activation</p>
          </div>

          <div className="contact-box">
            <p><strong>Need Help?</strong></p>
            <p>support@crowdmailer.com</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="payment-right">
          <h3>Payment Details</h3>

          <form onSubmit={handleSubmit}>
            <label>Email *</label>
            <input type="email" placeholder="example@email.com" required />

            <label>Phone Number *</label>
            <input type="tel" placeholder="98XXXXXXXX" required />

            <label>Name *</label>
            <input type="text" placeholder="Your Name" required />

            <label>Account Number *</label>
            <input type="text" placeholder="XXXX XXXX XXXX" required />

            <label>IFSC Code *</label>
            <input type="text" placeholder="SBIN000000" required />

            <button type="submit">
              Pay {planAmount[plan]} →
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BankDetails;
